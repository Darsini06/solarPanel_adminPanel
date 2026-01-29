from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from app.db import db
from datetime import datetime
from app.routes.auth import get_current_user
from app.models.drive_links import DriveLinkCreate, DriveLinkResponse, ReportGenerateRequest, ReportResponse
from typing import List, Optional
from bson import ObjectId
from bson.binary import Binary
import gridfs
from fastapi.responses import StreamingResponse

router = APIRouter(prefix="/drive-links", tags=["Drive Links"])
collection = db["drive_links"]
reports_collection = db["drive_reports"]
pdfs_collection = db["drive_pdfs"]




@router.post("/upload-pdf")
async def upload_pdf(
    pdf: UploadFile = File(...),
    link_id: str = Form(...),
    drive_link_1: Optional[str] = Form(None),
    drive_link_2: Optional[str] = Form(None)
):
    """Upload a PDF file for a specific drive link - NO AUTH REQUIRED"""
    
    try:
        print(f"Uploading PDF for link: {link_id}")
        print(f"Filename: {pdf.filename}")
        
        # Double validation for PDF files
        if not pdf.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="File must be a PDF")
        
        if not pdf.content_type or "pdf" not in pdf.content_type.lower():
            raise HTTPException(status_code=400, detail="File must be a PDF")
        
        MAX_SIZE = 10 * 1024 * 1024  # 10MB
        
        # Read file content
        content = await pdf.read()
        file_size = len(content)
        
        if file_size > MAX_SIZE:
            raise HTTPException(status_code=400, detail="PDF file size should be less than 10MB")
        
        # Verify link exists
        link_exists = collection.find_one({"_id": ObjectId(link_id)})
        if not link_exists:
            raise HTTPException(status_code=404, detail="Drive link not found")
        
        # Extract user info from the link (if available)
        # If no user info in link, use anonymous uploader
        user_email = link_exists.get("user_email", "anonymous@example.com")
        user_name = link_exists.get("user_name", "Anonymous User")
        user_id = link_exists.get("user_id", "anonymous")
        
        # Create user data based on link info
        uploader_user = {
            "_id": ObjectId(user_id) if user_id != "anonymous" and ObjectId.is_valid(user_id) else ObjectId(),
            "email": user_email,
            "first_name": user_name.split()[0] if user_name else "Anonymous",
            "last_name": " ".join(user_name.split()[1:]) if len(user_name.split()) > 1 else "User"
        }
        
        # Store PDF file in MongoDB using GridFS
        file_id = fs.put(
            content,
            filename=pdf.filename,
            content_type=pdf.content_type,
            link_id=link_id,
            user_id=str(uploader_user["_id"]),
            user_email=uploader_user["email"],
            metadata={
                "original_filename": pdf.filename,
                "uploaded_at": datetime.utcnow().isoformat(),
                "file_size": file_size,
                "upload_type": "link_upload"
            }
        )
        
        # Create PDF document record
        pdf_document = {
            "_id": ObjectId(),
            "file_id": file_id,
            "filename": pdf.filename,
            "link_id": link_id,
            "drive_link_1": drive_link_1 or link_exists.get("drive_link_1", ""),
            "drive_link_2": drive_link_2 or link_exists.get("drive_link_2", ""),
            "user_id": str(uploader_user["_id"]),
            "user_email": uploader_user["email"],
            "user_name": f"{uploader_user.get('first_name', '')} {uploader_user.get('last_name', '')}".strip(),
            "file_size": file_size,
            "content_type": pdf.content_type,
            "uploaded_at": datetime.utcnow(),
            "status": "uploaded",
            "stored_in": "mongodb_gridfs",
            "upload_type": "link_upload"
        }
        
        # Insert PDF metadata into database
        result = pdfs_collection.insert_one(pdf_document)
        pdf_id = str(result.inserted_id)
        
        # Update the drive link to show it has PDF
        collection.update_one(
            {"_id": ObjectId(link_id)},
            {"$set": {
                "has_pdf": True, 
                "pdf_id": pdf_id,
                "pdf_filename": pdf.filename,
                "pdf_uploaded_at": datetime.utcnow()
            }}
        )
        
        return {
            "message": "PDF uploaded successfully",
            "pdf_id": pdf_id,
            "file_id": str(file_id),
            "filename": pdf.filename,
            "link_id": link_id,
            "file_size": file_size,
            "uploaded_at": datetime.utcnow().isoformat(),
            "stored_in": "mongodb_gridfs"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error uploading PDF: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to upload PDF: {str(e)}")


# In your drive_links.py backend, update the upload_pdf function:



@router.get("/{link_id}/pdfs")
def get_link_pdfs(link_id: str, current_user = Depends(get_current_user)):
    """Get all PDFs uploaded for a specific drive link"""
    try:
        pdfs = list(pdfs_collection.find({"link_id": link_id}).sort("uploaded_at", -1))
        
        return [
            {
                "pdf_id": str(pdf["_id"]),
                "file_id": str(pdf.get("file_id", "")),
                "filename": pdf.get("filename", ""),
                "link_id": pdf.get("link_id", ""),
                "drive_link_1": pdf.get("drive_link_1", ""),
                "drive_link_2": pdf.get("drive_link_2", ""),
                "file_size": pdf.get("file_size", 0),
                "uploaded_at": pdf.get("uploaded_at", datetime.utcnow()).isoformat(),
                "uploaded_by": {
                    "user_id": pdf.get("user_id", ""),
                    "user_email": pdf.get("user_email", ""),
                    "user_name": pdf.get("user_name", "")
                },
                "stored_in": pdf.get("stored_in", "unknown")
            }
            for pdf in pdfs
        ]
        
    except Exception as e:
        print(f"Error fetching PDFs: {e}")
        raise HTTPException(status_code=500, detail="Error fetching PDFs")


# @router.get("/pdfs/my-pdfs")
# def get_my_pdfs(current_user = Depends(get_current_user)):
#     """Get all PDFs uploaded by current user"""
#     try:
#         user_id = str(current_user["_id"])
        
#         # Find all PDFs uploaded by this user
#         pdfs = list(pdfs_collection.find({"user_id": user_id}).sort("uploaded_at", -1))
        
#         return [
#             {
#                 "pdf_id": str(pdf["_id"]),
#                 "file_id": str(pdf.get("file_id", "")),
#                 "filename": pdf.get("filename", ""),
#                 "link_id": pdf.get("link_id", ""),
#                 "drive_link_1": pdf.get("drive_link_1", ""),
#                 "drive_link_2": pdf.get("drive_link_2", ""),
#                 "file_size": pdf.get("file_size", 0),
#                 "uploaded_at": pdf.get("uploaded_at", datetime.utcnow()).isoformat(),
#                 "uploaded_by": {
#                     "user_id": pdf.get("user_id", ""),
#                     "user_email": pdf.get("user_email", ""),
#                     "user_name": pdf.get("user_name", "")
#                 },
#                 "stored_in": pdf.get("stored_in", "unknown")
#             }
#             for pdf in pdfs
#         ]
        
#     except Exception as e:
#         print(f"Error fetching user PDFs: {e}")
#         raise HTTPException(status_code=500, detail="Error fetching PDFs")


# @router.get("/pdfs/all")
# def get_all_pdfs(current_user = Depends(get_current_user)):
#     """Get all PDFs (admin only)"""
#     try:
#         # You might want to add admin check here
#         pdfs = list(pdfs_collection.find().sort("uploaded_at", -1))
        
#         return [
#             {
#                 "pdf_id": str(pdf["_id"]),
#                 "file_id": str(pdf.get("file_id", "")),
#                 "filename": pdf.get("filename", ""),
#                 "link_id": pdf.get("link_id", ""),
#                 "drive_link_1": pdf.get("drive_link_1", ""),
#                 "drive_link_2": pdf.get("drive_link_2", ""),
#                 "file_size": pdf.get("file_size", 0),
#                 "uploaded_at": pdf.get("uploaded_at", datetime.utcnow()).isoformat(),
#                 "uploaded_by": {
#                     "user_id": pdf.get("user_id", ""),
#                     "user_email": pdf.get("user_email", ""),
#                     "user_name": pdf.get("user_name", "")
#                 },
#                 "stored_in": pdf.get("stored_in", "unknown")
#             }
#             for pdf in pdfs
#         ]
        
#     except Exception as e:
#         print(f"Error fetching all PDFs: {e}")
#         raise HTTPException(status_code=500, detail="Error fetching PDFs")

# @router.get("/pdfs/my-pdfs")
# def get_my_pdfs(current_user = Depends(get_current_user)):
#     """Get all PDFs for links owned by current user - FIXED VERSION"""
#     try:
#         user_id = str(current_user["_id"])
#         user_email = current_user.get("email", "")
        
#         print(f"🔍 Current user ID: {user_id}")
#         print(f"🔍 Current user email: {user_email}")
        
#         # CRITICAL FIX: Clean up the user_id format
#         # Some user_ids might have missing characters or different format
#         # Try multiple approaches
        
#         # Approach 1: Direct match by user_id (exact)
#         pdfs_direct = list(pdfs_collection.find({"user_id": user_id}))
#         print(f"📊 PDFs by direct user_id match: {len(pdfs_direct)}")
        
#         # Approach 2: Match by email (more reliable)
#         pdfs_by_email = list(pdfs_collection.find({"user_email": user_email}))
#         print(f"📊 PDFs by email match: {len(pdfs_by_email)}")
        
#         # Approach 3: Find all links owned by user, then get PDFs for those links
#         user_links = list(collection.find({"user_id": user_id}))
#         link_ids = [str(link["_id"]) for link in user_links]
#         print(f"📊 User has {len(link_ids)} links")
        
#         pdfs_by_links = []
#         if link_ids:
#             pdfs_by_links = list(pdfs_collection.find({"link_id": {"$in": link_ids}}))
#         print(f"📊 PDFs by link association: {len(pdfs_by_links)}")
        
#         # Approach 4: Try partial user_id match (for data inconsistencies)
#         # If user_id is "6978af2e2dccc39e30a387f7", look for "6978af2edcc39e30a387f7"
#         pdfs_partial = []
#         if user_id and len(user_id) >= 20:
#             # Create regex pattern for partial match
#             # This handles cases where a character might be missing or different
#             partial_pattern = user_id[:20]  # First 20 characters
#             pdfs_partial = list(pdfs_collection.find({
#                 "user_id": {"$regex": f"^{partial_pattern}"}
#             }))
#         print(f"📊 PDFs by partial user_id match: {len(pdfs_partial)}")
        
#         # Combine all results
#         all_pdfs_dict = {}
        
#         # Add PDFs from all approaches
#         for pdf_list in [pdfs_direct, pdfs_by_email, pdfs_by_links, pdfs_partial]:
#             for pdf in pdf_list:
#                 pdf_id = str(pdf["_id"])
#                 if pdf_id not in all_pdfs_dict:
#                     all_pdfs_dict[pdf_id] = pdf
        
#         all_found_pdfs = list(all_pdfs_dict.values())
#         print(f"🎯 Total unique PDFs found: {len(all_found_pdfs)}")
        
#         # Log for debugging
#         for pdf in all_found_pdfs[:3]:  # Show first 3 for debugging
#             print(f"📄 PDF: {pdf.get('filename')}, user_id: {pdf.get('user_id')}, email: {pdf.get('user_email')}")
        
#         return [
#             {
#                 "pdf_id": str(pdf["_id"]),
#                 "file_id": str(pdf.get("file_id", "")),
#                 "filename": pdf.get("filename", ""),
#                 "link_id": pdf.get("link_id", ""),
#                 "drive_link_1": pdf.get("drive_link_1", ""),
#                 "drive_link_2": pdf.get("drive_link_2", ""),
#                 "file_size": pdf.get("file_size", 0),
#                 "uploaded_at": pdf.get("uploaded_at", datetime.utcnow()).isoformat(),
#                 "uploaded_by": {
#                     "user_id": pdf.get("user_id", ""),
#                     "user_email": pdf.get("user_email", ""),
#                     "user_name": pdf.get("user_name", "")
#                 },
#                 "stored_in": pdf.get("stored_in", "unknown")
#             }
#             for pdf in all_found_pdfs
#         ]
        
#     except Exception as e:
#         print(f"❌ Error fetching user PDFs: {e}")
#         import traceback
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail="Error fetching PDFs")

@router.get("/pdfs/my-pdfs")
def get_my_pdfs(current_user = Depends(get_current_user)):
    """Get all PDFs for links owned by current user - FIXED VERSION"""
    try:
        user_id = str(current_user["_id"])
        user_email = current_user.get("email", "")
        
        print(f"🔍 Current user ID: {user_id}")
        print(f"🔍 Current user email: {user_email}")
        
        # Find PDFs by email (most reliable)
        pdfs = list(pdfs_collection.find({"user_email": user_email}).sort("uploaded_at", -1))
        
        print(f"✅ Found {len(pdfs)} PDFs for {user_email}")
        
        result = []
        for pdf in pdfs:
            # Handle uploaded_at field - it might be string or datetime
            uploaded_at = pdf.get("uploaded_at")
            if isinstance(uploaded_at, datetime):
                uploaded_at_str = uploaded_at.isoformat()
            elif isinstance(uploaded_at, str):
                uploaded_at_str = uploaded_at
            else:
                uploaded_at_str = datetime.utcnow().isoformat()
            
            pdf_data = {
                "pdf_id": str(pdf["_id"]),
                "file_id": str(pdf.get("file_id", "")),
                "filename": pdf.get("filename", ""),
                "link_id": pdf.get("link_id", ""),
                "drive_link_1": pdf.get("drive_link_1", ""),
                "drive_link_2": pdf.get("drive_link_2", ""),
                "file_size": pdf.get("file_size", 0),
                "uploaded_at": uploaded_at_str,  # Fixed: proper string format
                "uploaded_by": {
                    "user_id": pdf.get("user_id", ""),
                    "user_email": pdf.get("user_email", ""),
                    "user_name": pdf.get("user_name", "")
                },
                "stored_in": pdf.get("stored_in", "unknown")
            }
            result.append(pdf_data)
        
        return result
        
    except Exception as e:
        print(f"❌ Error fetching user PDFs: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Error fetching PDFs")
        


@router.get("/pdf/download/{pdf_id}")
async def download_pdf(pdf_id: str):
    """Download PDF file by ID from MongoDB"""
    try:
        # Get PDF metadata
        pdf_meta = pdfs_collection.find_one({"_id": ObjectId(pdf_id)})
        
        if not pdf_meta:
            raise HTTPException(status_code=404, detail="PDF not found")
        
        file_id = pdf_meta.get("file_id")
        if not file_id:
            raise HTTPException(status_code=404, detail="PDF file content not found")
        
        # Get file from GridFS
        grid_out = fs.get(file_id)
        
        # Create streaming response
        return StreamingResponse(
            iter(lambda: grid_out.read(1024), b''),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename={pdf_meta.get('filename', 'document.pdf')}",
                "Content-Length": str(pdf_meta.get("file_size", 0))
            }
        )
        
    except Exception as e:
        print(f"Error downloading PDF: {e}")
        raise HTTPException(status_code=500, detail="Error downloading PDF")


@router.get("/pdf/view/{pdf_id}")
async def view_pdf(pdf_id: str):
    """View PDF file by ID from MongoDB (inline viewing)"""
    try:
        # Get PDF metadata
        pdf_meta = pdfs_collection.find_one({"_id": ObjectId(pdf_id)})
        
        if not pdf_meta:
            raise HTTPException(status_code=404, detail="PDF not found")
        
        file_id = pdf_meta.get("file_id")
        if not file_id:
            raise HTTPException(status_code=404, detail="PDF file content not found")
        
        # Get file from GridFS
        grid_out = fs.get(file_id)
        
        # Read entire file for inline viewing
        file_content = grid_out.read()
        
        # Create response with inline disposition
        return StreamingResponse(
            iter([file_content]),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"inline; filename={pdf_meta.get('filename', 'document.pdf')}",
                "Content-Length": str(pdf_meta.get("file_size", 0))
            }
        )
        
    except Exception as e:
        print(f"Error viewing PDF: {e}")
        raise HTTPException(status_code=500, detail="Error viewing PDF")


@router.delete("/pdf/{pdf_id}")
async def delete_pdf(pdf_id: str, current_user = Depends(get_current_user)):
    """Delete a PDF file from MongoDB"""
    try:
        user_id = str(current_user["_id"])
        
        # Get PDF metadata
        pdf_meta = pdfs_collection.find_one({"_id": ObjectId(pdf_id)})
        
        if not pdf_meta:
            raise HTTPException(status_code=404, detail="PDF not found")
        
        # Check if user is authorized (owner or admin)
        if pdf_meta.get("user_id") != user_id:
            # You might want to add admin check here
            raise HTTPException(status_code=403, detail="Not authorized to delete this PDF")
        
        file_id = pdf_meta.get("file_id")
        
        # Delete from GridFS if exists
        if file_id:
            try:
                fs.delete(file_id)
            except:
                pass  # File might already be deleted
        
        # Delete metadata
        result = pdfs_collection.delete_one({"_id": ObjectId(pdf_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="PDF metadata not found")
        
        # Update the drive link if it references this PDF
        link_id = pdf_meta.get("link_id")
        if link_id:
            collection.update_one(
                {"_id": ObjectId(link_id)},
                {"$set": {
                    "has_pdf": False, 
                    "pdf_id": None,
                    "pdf_filename": None,
                    "pdf_uploaded_at": None
                }}
            )
        
        return {"message": "PDF deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting PDF: {e}")
        raise HTTPException(status_code=500, detail="Error deleting PDF")

        # Add this new endpoint in drive_links.py

@router.get("/pdfs/by-link-user/{link_id}")
def get_pdfs_by_link_user(link_id: str, current_user = Depends(get_current_user)):
    """Get PDFs for a specific link, accessible by the link owner"""
    try:
        # First, verify the link exists and get its owner
        link = collection.find_one({"_id": ObjectId(link_id)})
        if not link:
            raise HTTPException(status_code=404, detail="Link not found")
        
        # Check if current user is the link owner
        link_user_id = link.get("user_id")
        current_user_id = str(current_user["_id"])
        
        if link_user_id != current_user_id:
            raise HTTPException(status_code=403, detail="Not authorized to view these PDFs")
        
        # Find all PDFs for this link
        pdfs = list(pdfs_collection.find({"link_id": link_id}).sort("uploaded_at", -1))
        
        return [
            {
                "pdf_id": str(pdf["_id"]),
                "file_id": str(pdf.get("file_id", "")),
                "filename": pdf.get("filename", ""),
                "link_id": pdf.get("link_id", ""),
                "drive_link_1": pdf.get("drive_link_1", ""),
                "drive_link_2": pdf.get("drive_link_2", ""),
                "file_size": pdf.get("file_size", 0),
                "uploaded_at": pdf.get("uploaded_at", datetime.utcnow()).isoformat(),
                "uploaded_by": {
                    "user_id": pdf.get("uploaded_by_user_id", ""),
                    "user_email": pdf.get("uploaded_by_email", ""),
                    "user_name": "Admin" if pdf.get("is_admin_upload") else "You"
                },
                "stored_in": pdf.get("stored_in", "unknown"),
                "is_admin_upload": pdf.get("is_admin_upload", False)
            }
            for pdf in pdfs
        ]
        
    except Exception as e:
        print(f"Error fetching PDFs by link user: {e}")
        raise HTTPException(status_code=500, detail="Error fetching PDFs")


@router.post("/", response_model=DriveLinkResponse)
def save_drive_links(payload: DriveLinkCreate, current_user = Depends(get_current_user)):
    print("POST PAYLOAD:", payload)
    print("CURRENT USER:", current_user)

    document = {
        "drive_link_1": payload.drive_link_1,
        "drive_link_2": payload.drive_link_2,
        "user_id": str(current_user["_id"]),
        "user_email": current_user["email"],
        "user_name": f"{current_user.get('first_name', '')} {current_user.get('last_name', '')}".strip(),
        "created_at": datetime.utcnow(),
        "has_pdf": False,
        "pdf_id": None,
        "pdf_filename": None
    }

    result = collection.insert_one(document)

    print("INSERTED ID:", result.inserted_id)

    return DriveLinkResponse(
        id=str(result.inserted_id),
        drive_link_1=payload.drive_link_1,
        drive_link_2=payload.drive_link_2,
        user_id=str(current_user["_id"]),
        user_email=current_user["email"],
        user_name=f"{current_user.get('first_name', '')} {current_user.get('last_name', '')}".strip(),
        created_at=document["created_at"],
        has_pdf=False,
        pdf_id=None,
        pdf_filename=None
    )


# @router.get("/", response_model=List[DriveLinkResponse])
# def get_drive_links():
#     data = list(collection.find())
#     print("FETCH COUNT:", len(data))

#     return [
#         DriveLinkResponse(
#             id=str(item["_id"]),
#             drive_link_1=item.get("drive_link_1", ""),
#             drive_link_2=item.get("drive_link_2", ""),
#             user_id=item.get("user_id", ""),
#             user_email=item.get("user_email", ""),
#             user_name=item.get("user_name", ""),
#             created_at=item.get("created_at", datetime.utcnow()),
#             has_pdf=item.get("has_pdf", False),
#             pdf_id=item.get("pdf_id"),
#             pdf_filename=item.get("pdf_filename")
#         )
#         for item in data
#     ]
@router.get("/", response_model=List[DriveLinkResponse])
def get_drive_links():
    data = list(collection.find())
    print("FETCH COUNT:", len(data))

    result = []
    for item in data:
        # Handle created_at field
        created_at = item.get("created_at")
        if not isinstance(created_at, datetime):
            if isinstance(created_at, str):
                try:
                    created_at = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                except:
                    created_at = datetime.utcnow()
            else:
                created_at = datetime.utcnow()
        
        result.append(DriveLinkResponse(
            id=str(item["_id"]),
            drive_link_1=item.get("drive_link_1", ""),
            drive_link_2=item.get("drive_link_2", ""),
            user_id=item.get("user_id", ""),
            user_email=item.get("user_email", ""),
            user_name=item.get("user_name", ""),
            created_at=created_at,
            has_pdf=item.get("has_pdf", False),
            pdf_id=item.get("pdf_id"),
            pdf_filename=item.get("pdf_filename")
        ))
    
    return result


@router.get("/my-links", response_model=List[DriveLinkResponse])
def get_my_drive_links(current_user = Depends(get_current_user)):
    """Get drive links added by current user only"""
    user_id = str(current_user["_id"])
    data = list(collection.find({"user_id": user_id}))
    print(f"FETCH COUNT for {current_user['email']}:", len(data))

    result = []
    for item in data:
        # Handle created_at field
        created_at = item.get("created_at")
        if not isinstance(created_at, datetime):
            if isinstance(created_at, str):
                try:
                    created_at = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                except:
                    created_at = datetime.utcnow()
            else:
                created_at = datetime.utcnow()
        
        result.append(DriveLinkResponse(
            id=str(item["_id"]),
            drive_link_1=item.get("drive_link_1", ""),
            drive_link_2=item.get("drive_link_2", ""),
            user_id=item.get("user_id", ""),
            user_email=item.get("user_email", ""),
            user_name=item.get("user_name", ""),
            created_at=created_at,
            has_pdf=item.get("has_pdf", False),
            pdf_id=item.get("pdf_id"),
            pdf_filename=item.get("pdf_filename")
        ))
    
    return result


@router.get("/my-links", response_model=List[DriveLinkResponse])
def get_my_drive_links(current_user = Depends(get_current_user)):
    """Get drive links added by current user only"""
    user_id = str(current_user["_id"])
    data = list(collection.find({"user_id": user_id}))
    print(f"FETCH COUNT for {current_user['email']}:", len(data))

    return [
        DriveLinkResponse(
            id=str(item["_id"]),
            drive_link_1=item.get("drive_link_1", ""),
            drive_link_2=item.get("drive_link_2", ""),
            user_id=item.get("user_id", ""),
            user_email=item.get("user_email", ""),
            user_name=item.get("user_name", ""),
            created_at=item.get("created_at", datetime.utcnow()),
            has_pdf=item.get("has_pdf", False),
            pdf_id=item.get("pdf_id"),
            pdf_filename=item.get("pdf_filename")
        )
        for item in data
    ]


@router.get("/user/{user_id}", response_model=List[DriveLinkResponse])
def get_user_drive_links(user_id: str):
    """Get drive links for a specific user"""
    data = list(collection.find({"user_id": user_id}))
    print(f"FETCH COUNT for user {user_id}:", len(data))

    return [
        DriveLinkResponse(
            id=str(item["_id"]),
            drive_link_1=item.get("drive_link_1", ""),
            drive_link_2=item.get("drive_link_2", ""),
            user_id=item.get("user_id", ""),
            user_email=item.get("user_email", ""),
            user_name=item.get("user_name", ""),
            created_at=item.get("created_at", datetime.utcnow()),
            has_pdf=item.get("has_pdf", False),
            pdf_id=item.get("pdf_id"),
            pdf_filename=item.get("pdf_filename")
        )
        for item in data
    ]


# @router.get("/my-links-with-pdfs")
# def get_my_links_with_pdfs(current_user = Depends(get_current_user)):
#     """Get drive links with their associated PDFs for current user"""
#     try:
#         user_id = str(current_user["_id"])
        
#         # Get all links for the user
#         links = list(collection.find({"user_id": user_id}).sort("created_at", -1))
        
#         # Get all PDFs for the user
#         pdfs = list(pdfs_collection.find({"user_id": user_id}))
        
#         # Group PDFs by link_id
#         pdfs_by_link = {}
#         for pdf in pdfs:
#             link_id = pdf.get("link_id")
#             if link_id not in pdfs_by_link:
#                 pdfs_by_link[link_id] = []
#             pdfs_by_link[link_id].append({
#                 "pdf_id": str(pdf["_id"]),
#                 "filename": pdf.get("filename", ""),
#                 "file_size": pdf.get("file_size", 0),
#                 "uploaded_at": pdf.get("uploaded_at", datetime.utcnow()).isoformat()
#             })
        
#         # Combine links with their PDFs
#         result = []
#         for link in links:
#             link_id = str(link["_id"])
#             link_data = {
#                 "id": link_id,
#                 "drive_link_1": link.get("drive_link_1", ""),
#                 "drive_link_2": link.get("drive_link_2", ""),
#                 "user_id": link.get("user_id", ""),
#                 "user_email": link.get("user_email", ""),
#                 "user_name": link.get("user_name", ""),
#                 "created_at": link.get("created_at", datetime.utcnow()).isoformat(),
#                 "has_pdf": link.get("has_pdf", False),
#                 "pdf_id": link.get("pdf_id"),
#                 "pdf_filename": link.get("pdf_filename"),
#                 "pdfs": pdfs_by_link.get(link_id, [])
#             }
#             result.append(link_data)
        
#         return result
        
#     except Exception as e:
#         print(f"Error fetching links with PDFs: {e}")
#         raise HTTPException(status_code=500, detail="Error fetching links with PDFs")

@router.get("/my-links-with-pdfs")
def get_my_links_with_pdfs(current_user = Depends(get_current_user)):
    """Get drive links with their associated PDFs for current user"""
    try:
        user_id = str(current_user["_id"])
        
        # Get all links for the user
        links = list(collection.find({"user_id": user_id}).sort("created_at", -1))
        
        # Get all PDFs for the user
        pdfs = list(pdfs_collection.find({"user_id": user_id}))
        
        # Group PDFs by link_id
        pdfs_by_link = {}
        for pdf in pdfs:
            link_id = pdf.get("link_id")
            if link_id not in pdfs_by_link:
                pdfs_by_link[link_id] = []
            
            # Handle uploaded_at field
            uploaded_at = pdf.get("uploaded_at")
            if isinstance(uploaded_at, datetime):
                uploaded_at_str = uploaded_at.isoformat()
            elif isinstance(uploaded_at, str):
                uploaded_at_str = uploaded_at
            else:
                uploaded_at_str = datetime.utcnow().isoformat()
            
            pdfs_by_link[link_id].append({
                "pdf_id": str(pdf["_id"]),
                "filename": pdf.get("filename", ""),
                "file_size": pdf.get("file_size", 0),
                "uploaded_at": uploaded_at_str  # Fixed
            })
        
        # Combine links with their PDFs
        result = []
        for link in links:
            link_id = str(link["_id"])
            
            # Handle created_at field
            created_at = link.get("created_at")
            if isinstance(created_at, datetime):
                created_at_str = created_at.isoformat()
            elif isinstance(created_at, str):
                created_at_str = created_at
            else:
                created_at_str = datetime.utcnow().isoformat()
            
            link_data = {
                "id": link_id,
                "drive_link_1": link.get("drive_link_1", ""),
                "drive_link_2": link.get("drive_link_2", ""),
                "user_id": link.get("user_id", ""),
                "user_email": link.get("user_email", ""),
                "user_name": link.get("user_name", ""),
                "created_at": created_at_str,  # Fixed
                "has_pdf": link.get("has_pdf", False),
                "pdf_id": link.get("pdf_id"),
                "pdf_filename": link.get("pdf_filename"),
                "pdfs": pdfs_by_link.get(link_id, [])
            }
            result.append(link_data)
        
        return result
        
    except Exception as e:
        print(f"Error fetching links with PDFs: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Error fetching links with PDFs")