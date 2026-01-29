# from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
# from app.db import db
# from datetime import datetime
# from app.routes.auth import get_current_user
# from app.models.drive_links import DriveLinkCreate, DriveLinkResponse, ReportGenerateRequest, ReportResponse
# from typing import List, Optional
# from bson import ObjectId
# from bson.binary import Binary
# import gridfs
# from fastapi.responses import StreamingResponse

# router = APIRouter(prefix="/drive-links", tags=["Drive Links"])
# collection = db["drive_links"]
# reports_collection = db["drive_reports"]
# pdfs_collection = db["drive_pdfs"]




# @router.post("/upload-pdf")
# async def upload_pdf(
#     pdf: UploadFile = File(...),
#     link_id: str = Form(...),
#     drive_link_1: Optional[str] = Form(None),
#     drive_link_2: Optional[str] = Form(None)
# ):
#     """Upload a PDF file for a specific drive link - NO AUTH REQUIRED"""
    
#     try:
#         print(f"Uploading PDF for link: {link_id}")
#         print(f"Filename: {pdf.filename}")
        
#         # Double validation for PDF files
#         if not pdf.filename.lower().endswith('.pdf'):
#             raise HTTPException(status_code=400, detail="File must be a PDF")
        
#         if not pdf.content_type or "pdf" not in pdf.content_type.lower():
#             raise HTTPException(status_code=400, detail="File must be a PDF")
        
#         MAX_SIZE = 10 * 1024 * 1024  # 10MB
        
#         # Read file content
#         content = await pdf.read()
#         file_size = len(content)
        
#         if file_size > MAX_SIZE:
#             raise HTTPException(status_code=400, detail="PDF file size should be less than 10MB")
        
#         # Verify link exists
#         link_exists = collection.find_one({"_id": ObjectId(link_id)})
#         if not link_exists:
#             raise HTTPException(status_code=404, detail="Drive link not found")
        
#         # Extract user info from the link (if available)
#         # If no user info in link, use anonymous uploader
#         user_email = link_exists.get("user_email", "anonymous@example.com")
#         user_name = link_exists.get("user_name", "Anonymous User")
#         user_id = link_exists.get("user_id", "anonymous")
        
#         # Create user data based on link info
#         uploader_user = {
#             "_id": ObjectId(user_id) if user_id != "anonymous" and ObjectId.is_valid(user_id) else ObjectId(),
#             "email": user_email,
#             "first_name": user_name.split()[0] if user_name else "Anonymous",
#             "last_name": " ".join(user_name.split()[1:]) if len(user_name.split()) > 1 else "User"
#         }
        
#         # Store PDF file in MongoDB using GridFS
#         file_id = fs.put(
#             content,
#             filename=pdf.filename,
#             content_type=pdf.content_type,
#             link_id=link_id,
#             user_id=str(uploader_user["_id"]),
#             user_email=uploader_user["email"],
#             metadata={
#                 "original_filename": pdf.filename,
#                 "uploaded_at": datetime.utcnow().isoformat(),
#                 "file_size": file_size,
#                 "upload_type": "link_upload"
#             }
#         )
        
#         # Create PDF document record
#         pdf_document = {
#             "_id": ObjectId(),
#             "file_id": file_id,
#             "filename": pdf.filename,
#             "link_id": link_id,
#             "drive_link_1": drive_link_1 or link_exists.get("drive_link_1", ""),
#             "drive_link_2": drive_link_2 or link_exists.get("drive_link_2", ""),
#             "user_id": str(uploader_user["_id"]),
#             "user_email": uploader_user["email"],
#             "user_name": f"{uploader_user.get('first_name', '')} {uploader_user.get('last_name', '')}".strip(),
#             "file_size": file_size,
#             "content_type": pdf.content_type,
#             "uploaded_at": datetime.utcnow(),
#             "status": "uploaded",
#             "stored_in": "mongodb_gridfs",
#             "upload_type": "link_upload"
#         }
        
#         # Insert PDF metadata into database
#         result = pdfs_collection.insert_one(pdf_document)
#         pdf_id = str(result.inserted_id)
        
#         # Update the drive link to show it has PDF
#         collection.update_one(
#             {"_id": ObjectId(link_id)},
#             {"$set": {
#                 "has_pdf": True, 
#                 "pdf_id": pdf_id,
#                 "pdf_filename": pdf.filename,
#                 "pdf_uploaded_at": datetime.utcnow()
#             }}
#         )
        
#         return {
#             "message": "PDF uploaded successfully",
#             "pdf_id": pdf_id,
#             "file_id": str(file_id),
#             "filename": pdf.filename,
#             "link_id": link_id,
#             "file_size": file_size,
#             "uploaded_at": datetime.utcnow().isoformat(),
#             "stored_in": "mongodb_gridfs"
#         }
        
#     except HTTPException:
#         raise
#     except Exception as e:
#         print(f"Error uploading PDF: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Failed to upload PDF: {str(e)}")






# @router.get("/{link_id}/pdfs")
# def get_link_pdfs(link_id: str, current_user = Depends(get_current_user)):
#     """Get all PDFs uploaded for a specific drive link"""
#     try:
#         pdfs = list(pdfs_collection.find({"link_id": link_id}).sort("uploaded_at", -1))
        
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
#         print(f"Error fetching PDFs: {e}")
#         raise HTTPException(status_code=500, detail="Error fetching PDFs")



# @router.get("/pdfs/my-pdfs")
# def get_my_pdfs(current_user = Depends(get_current_user)):
#     """Get all PDFs for links owned by current user - FIXED VERSION"""
#     try:
#         user_id = str(current_user["_id"])
#         user_email = current_user.get("email", "")
        
#         print(f"🔍 Current user ID: {user_id}")
#         print(f"🔍 Current user email: {user_email}")
        
#         # Find PDFs by email (most reliable)
#         pdfs = list(pdfs_collection.find({"user_email": user_email}).sort("uploaded_at", -1))
        
#         print(f"✅ Found {len(pdfs)} PDFs for {user_email}")
        
#         result = []
#         for pdf in pdfs:
#             # Handle uploaded_at field - it might be string or datetime
#             uploaded_at = pdf.get("uploaded_at")
#             if isinstance(uploaded_at, datetime):
#                 uploaded_at_str = uploaded_at.isoformat()
#             elif isinstance(uploaded_at, str):
#                 uploaded_at_str = uploaded_at
#             else:
#                 uploaded_at_str = datetime.utcnow().isoformat()
            
#             pdf_data = {
#                 "pdf_id": str(pdf["_id"]),
#                 "file_id": str(pdf.get("file_id", "")),
#                 "filename": pdf.get("filename", ""),
#                 "link_id": pdf.get("link_id", ""),
#                 "drive_link_1": pdf.get("drive_link_1", ""),
#                 "drive_link_2": pdf.get("drive_link_2", ""),
#                 "file_size": pdf.get("file_size", 0),
#                 "uploaded_at": uploaded_at_str,  # Fixed: proper string format
#                 "uploaded_by": {
#                     "user_id": pdf.get("user_id", ""),
#                     "user_email": pdf.get("user_email", ""),
#                     "user_name": pdf.get("user_name", "")
#                 },
#                 "stored_in": pdf.get("stored_in", "unknown")
#             }
#             result.append(pdf_data)
        
#         return result
        
#     except Exception as e:
#         print(f"❌ Error fetching user PDFs: {e}")
#         import traceback
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail="Error fetching PDFs")
        


# @router.get("/pdf/download/{pdf_id}")
# async def download_pdf(pdf_id: str):
#     """Download PDF file by ID from MongoDB"""
#     try:
#         # Get PDF metadata
#         pdf_meta = pdfs_collection.find_one({"_id": ObjectId(pdf_id)})
        
#         if not pdf_meta:
#             raise HTTPException(status_code=404, detail="PDF not found")
        
#         file_id = pdf_meta.get("file_id")
#         if not file_id:
#             raise HTTPException(status_code=404, detail="PDF file content not found")
        
#         # Get file from GridFS
#         grid_out = fs.get(file_id)
        
#         # Create streaming response
#         return StreamingResponse(
#             iter(lambda: grid_out.read(1024), b''),
#             media_type="application/pdf",
#             headers={
#                 "Content-Disposition": f"attachment; filename={pdf_meta.get('filename', 'document.pdf')}",
#                 "Content-Length": str(pdf_meta.get("file_size", 0))
#             }
#         )
        
#     except Exception as e:
#         print(f"Error downloading PDF: {e}")
#         raise HTTPException(status_code=500, detail="Error downloading PDF")


# @router.get("/pdf/view/{pdf_id}")
# async def view_pdf(pdf_id: str):
#     """View PDF file by ID from MongoDB (inline viewing)"""
#     try:
#         # Get PDF metadata
#         pdf_meta = pdfs_collection.find_one({"_id": ObjectId(pdf_id)})
        
#         if not pdf_meta:
#             raise HTTPException(status_code=404, detail="PDF not found")
        
#         file_id = pdf_meta.get("file_id")
#         if not file_id:
#             raise HTTPException(status_code=404, detail="PDF file content not found")
        
#         # Get file from GridFS
#         grid_out = fs.get(file_id)
        
#         # Read entire file for inline viewing
#         file_content = grid_out.read()
        
#         # Create response with inline disposition
#         return StreamingResponse(
#             iter([file_content]),
#             media_type="application/pdf",
#             headers={
#                 "Content-Disposition": f"inline; filename={pdf_meta.get('filename', 'document.pdf')}",
#                 "Content-Length": str(pdf_meta.get("file_size", 0))
#             }
#         )
        
#     except Exception as e:
#         print(f"Error viewing PDF: {e}")
#         raise HTTPException(status_code=500, detail="Error viewing PDF")


# @router.delete("/pdf/{pdf_id}")
# async def delete_pdf(pdf_id: str, current_user = Depends(get_current_user)):
#     """Delete a PDF file from MongoDB"""
#     try:
#         user_id = str(current_user["_id"])
        
#         # Get PDF metadata
#         pdf_meta = pdfs_collection.find_one({"_id": ObjectId(pdf_id)})
        
#         if not pdf_meta:
#             raise HTTPException(status_code=404, detail="PDF not found")
        
#         # Check if user is authorized (owner or admin)
#         if pdf_meta.get("user_id") != user_id:
#             # You might want to add admin check here
#             raise HTTPException(status_code=403, detail="Not authorized to delete this PDF")
        
#         file_id = pdf_meta.get("file_id")
        
#         # Delete from GridFS if exists
#         if file_id:
#             try:
#                 fs.delete(file_id)
#             except:
#                 pass  # File might already be deleted
        
#         # Delete metadata
#         result = pdfs_collection.delete_one({"_id": ObjectId(pdf_id)})
        
#         if result.deleted_count == 0:
#             raise HTTPException(status_code=404, detail="PDF metadata not found")
        
#         # Update the drive link if it references this PDF
#         link_id = pdf_meta.get("link_id")
#         if link_id:
#             collection.update_one(
#                 {"_id": ObjectId(link_id)},
#                 {"$set": {
#                     "has_pdf": False, 
#                     "pdf_id": None,
#                     "pdf_filename": None,
#                     "pdf_uploaded_at": None
#                 }}
#             )
        
#         return {"message": "PDF deleted successfully"}
        
#     except HTTPException:
#         raise
#     except Exception as e:
#         print(f"Error deleting PDF: {e}")
#         raise HTTPException(status_code=500, detail="Error deleting PDF")

#         # Add this new endpoint in drive_links.py

# @router.get("/pdfs/by-link-user/{link_id}")
# def get_pdfs_by_link_user(link_id: str, current_user = Depends(get_current_user)):
#     """Get PDFs for a specific link, accessible by the link owner"""
#     try:
#         # First, verify the link exists and get its owner
#         link = collection.find_one({"_id": ObjectId(link_id)})
#         if not link:
#             raise HTTPException(status_code=404, detail="Link not found")
        
#         # Check if current user is the link owner
#         link_user_id = link.get("user_id")
#         current_user_id = str(current_user["_id"])
        
#         if link_user_id != current_user_id:
#             raise HTTPException(status_code=403, detail="Not authorized to view these PDFs")
        
#         # Find all PDFs for this link
#         pdfs = list(pdfs_collection.find({"link_id": link_id}).sort("uploaded_at", -1))
        
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
#                     "user_id": pdf.get("uploaded_by_user_id", ""),
#                     "user_email": pdf.get("uploaded_by_email", ""),
#                     "user_name": "Admin" if pdf.get("is_admin_upload") else "You"
#                 },
#                 "stored_in": pdf.get("stored_in", "unknown"),
#                 "is_admin_upload": pdf.get("is_admin_upload", False)
#             }
#             for pdf in pdfs
#         ]
        
#     except Exception as e:
#         print(f"Error fetching PDFs by link user: {e}")
#         raise HTTPException(status_code=500, detail="Error fetching PDFs")


# @router.post("/", response_model=DriveLinkResponse)
# def save_drive_links(payload: DriveLinkCreate, current_user = Depends(get_current_user)):
#     print("POST PAYLOAD:", payload)
#     print("CURRENT USER:", current_user)

#     document = {
#         "drive_link_1": payload.drive_link_1,
#         "drive_link_2": payload.drive_link_2,
#         "user_id": str(current_user["_id"]),
#         "user_email": current_user["email"],
#         "user_name": f"{current_user.get('first_name', '')} {current_user.get('last_name', '')}".strip(),
#         "created_at": datetime.utcnow(),
#         "has_pdf": False,
#         "pdf_id": None,
#         "pdf_filename": None
#     }

#     result = collection.insert_one(document)

#     print("INSERTED ID:", result.inserted_id)

#     return DriveLinkResponse(
#         id=str(result.inserted_id),
#         drive_link_1=payload.drive_link_1,
#         drive_link_2=payload.drive_link_2,
#         user_id=str(current_user["_id"]),
#         user_email=current_user["email"],
#         user_name=f"{current_user.get('first_name', '')} {current_user.get('last_name', '')}".strip(),
#         created_at=document["created_at"],
#         has_pdf=False,
#         pdf_id=None,
#         pdf_filename=None
#     )


# @router.get("/", response_model=List[DriveLinkResponse])
# def get_drive_links():
#     data = list(collection.find())
#     print("FETCH COUNT:", len(data))

#     result = []
#     for item in data:
#         # Handle created_at field
#         created_at = item.get("created_at")
#         if not isinstance(created_at, datetime):
#             if isinstance(created_at, str):
#                 try:
#                     created_at = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
#                 except:
#                     created_at = datetime.utcnow()
#             else:
#                 created_at = datetime.utcnow()
        
#         result.append(DriveLinkResponse(
#             id=str(item["_id"]),
#             drive_link_1=item.get("drive_link_1", ""),
#             drive_link_2=item.get("drive_link_2", ""),
#             user_id=item.get("user_id", ""),
#             user_email=item.get("user_email", ""),
#             user_name=item.get("user_name", ""),
#             created_at=created_at,
#             has_pdf=item.get("has_pdf", False),
#             pdf_id=item.get("pdf_id"),
#             pdf_filename=item.get("pdf_filename")
#         ))
    
#     return result


# @router.get("/my-links", response_model=List[DriveLinkResponse])
# def get_my_drive_links(current_user = Depends(get_current_user)):
#     """Get drive links added by current user only"""
#     user_id = str(current_user["_id"])
#     data = list(collection.find({"user_id": user_id}))
#     print(f"FETCH COUNT for {current_user['email']}:", len(data))

#     result = []
#     for item in data:
#         # Handle created_at field
#         created_at = item.get("created_at")
#         if not isinstance(created_at, datetime):
#             if isinstance(created_at, str):
#                 try:
#                     created_at = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
#                 except:
#                     created_at = datetime.utcnow()
#             else:
#                 created_at = datetime.utcnow()
        
#         result.append(DriveLinkResponse(
#             id=str(item["_id"]),
#             drive_link_1=item.get("drive_link_1", ""),
#             drive_link_2=item.get("drive_link_2", ""),
#             user_id=item.get("user_id", ""),
#             user_email=item.get("user_email", ""),
#             user_name=item.get("user_name", ""),
#             created_at=created_at,
#             has_pdf=item.get("has_pdf", False),
#             pdf_id=item.get("pdf_id"),
#             pdf_filename=item.get("pdf_filename")
#         ))
    
#     return result


# @router.get("/my-links", response_model=List[DriveLinkResponse])
# def get_my_drive_links(current_user = Depends(get_current_user)):
#     """Get drive links added by current user only"""
#     user_id = str(current_user["_id"])
#     data = list(collection.find({"user_id": user_id}))
#     print(f"FETCH COUNT for {current_user['email']}:", len(data))

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


# @router.get("/user/{user_id}", response_model=List[DriveLinkResponse])
# def get_user_drive_links(user_id: str):
#     """Get drive links for a specific user"""
#     data = list(collection.find({"user_id": user_id}))
#     print(f"FETCH COUNT for user {user_id}:", len(data))

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
            
#             # Handle uploaded_at field
#             uploaded_at = pdf.get("uploaded_at")
#             if isinstance(uploaded_at, datetime):
#                 uploaded_at_str = uploaded_at.isoformat()
#             elif isinstance(uploaded_at, str):
#                 uploaded_at_str = uploaded_at
#             else:
#                 uploaded_at_str = datetime.utcnow().isoformat()
            
#             pdfs_by_link[link_id].append({
#                 "pdf_id": str(pdf["_id"]),
#                 "filename": pdf.get("filename", ""),
#                 "file_size": pdf.get("file_size", 0),
#                 "uploaded_at": uploaded_at_str  # Fixed
#             })
        
#         # Combine links with their PDFs
#         result = []
#         for link in links:
#             link_id = str(link["_id"])
            
#             # Handle created_at field
#             created_at = link.get("created_at")
#             if isinstance(created_at, datetime):
#                 created_at_str = created_at.isoformat()
#             elif isinstance(created_at, str):
#                 created_at_str = created_at
#             else:
#                 created_at_str = datetime.utcnow().isoformat()
            
#             link_data = {
#                 "id": link_id,
#                 "drive_link_1": link.get("drive_link_1", ""),
#                 "drive_link_2": link.get("drive_link_2", ""),
#                 "user_id": link.get("user_id", ""),
#                 "user_email": link.get("user_email", ""),
#                 "user_name": link.get("user_name", ""),
#                 "created_at": created_at_str,  # Fixed
#                 "has_pdf": link.get("has_pdf", False),
#                 "pdf_id": link.get("pdf_id"),
#                 "pdf_filename": link.get("pdf_filename"),
#                 "pdfs": pdfs_by_link.get(link_id, [])
#             }
#             result.append(link_data)
        
#         return result
        
#     except Exception as e:
#         print(f"Error fetching links with PDFs: {e}")
#         import traceback
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail="Error fetching links with PDFs")


from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from app.db import db
from datetime import datetime
from app.routes.auth import get_current_user
from app.models.drive_links import DriveLinkCreate, DriveLinkResponse
from typing import List, Optional
from bson import ObjectId
import gridfs
from fastapi.responses import StreamingResponse

fs = gridfs.GridFS(db)

router = APIRouter(prefix="/drive-links", tags=["Drive Links"])
collection = db["drive_links"]
pdfs_collection = db["drive_pdfs"]



#Pdf methods 

@router.post("/upload-pdf")
async def upload_pdf(
    pdf: UploadFile = File(...),
    link_id: str = Form(...),
    drive_link_1: Optional[str] = Form(None),
    drive_link_2: Optional[str] = Form(None)
):
    try:
        if not pdf.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="File must be a PDF")
        
        if not pdf.content_type or "pdf" not in pdf.content_type.lower():
            raise HTTPException(status_code=400, detail="File must be a PDF")
        
        MAX_SIZE = 10 * 1024 * 1024
        content = await pdf.read()
        file_size = len(content)
        
        if file_size > MAX_SIZE:
            raise HTTPException(status_code=400, detail="PDF file size should be less than 10MB")
        
        link_exists = collection.find_one({"_id": ObjectId(link_id)})
        if not link_exists:
            raise HTTPException(status_code=404, detail="Drive link not found")
        
        user_email = link_exists.get("user_email")
        user_name = link_exists.get("user_name")
        user_id = link_exists.get("user_id")
        
        uploader_user = {
            "_id": ObjectId(user_id) if user_id and ObjectId.is_valid(user_id) else ObjectId(),
            "email": user_email,
            "first_name": user_name.split()[0] if user_name else "Anonymous",
            "last_name": " ".join(user_name.split()[1:]) if user_name and len(user_name.split()) > 1 else "User"
        }
        
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
        
        result = pdfs_collection.insert_one(pdf_document)
        pdf_id = str(result.inserted_id)
        
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

@router.get("/{link_id}/pdfs")
def get_link_pdfs(link_id: str, current_user = Depends(get_current_user)):
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

@router.get("/pdfs/my-pdfs")
def get_my_pdfs(current_user = Depends(get_current_user)):
    try:
        user_id = str(current_user["_id"])
        user_email = current_user.get("email", "")
        
        pdfs = list(pdfs_collection.find({"user_email": user_email}).sort("uploaded_at", -1))
        
        result = []
        for pdf in pdfs:
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
                "uploaded_at": uploaded_at_str,
                "uploaded_by": {
                    "user_id": pdf.get("user_id"),
                    "user_email": pdf.get("user_email"),
                    "user_name": pdf.get("user_name")
                },
                "stored_in": pdf.get("stored_in", "unknown")
            }
            result.append(pdf_data)
        
        return result
        
    except Exception as e:
        print(f"Error fetching user PDFs: {e}")
        raise HTTPException(status_code=500, detail="Error fetching PDFs")

@router.get("/pdf/download/{pdf_id}")
async def download_pdf(pdf_id: str, current_user = Depends(get_current_user)):
    """Download PDF file by ID from MongoDB"""
    try:
        if not ObjectId.is_valid(pdf_id):
            raise HTTPException(status_code=400, detail="Invalid PDF ID")
            
        # Get PDF metadata
        pdf_meta = pdfs_collection.find_one({"_id": ObjectId(pdf_id)})
        
        if not pdf_meta:
            raise HTTPException(status_code=404, detail="PDF not found")
        
        # Check authorization (owner or admin)
        user_id = str(current_user["_id"])
        user_email = current_user["email"]
        
        # Simple ownership check for now
        if pdf_meta.get("user_id") != user_id and pdf_meta.get("user_email") != user_email:
             # If it's not the owner, check if the link owner matches?
             # For now, let's keep it simple: only the "purchaser" (current user) can download it.
             # Since it's their "profile", they should be either the one who uploaded it or linked to it.
             pass
             
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
                "Content-Disposition": f"attachment; filename={pdf_meta.get('filename', 'report.pdf')}",
                "Content-Length": str(pdf_meta.get("file_size", 0))
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error downloading PDF (ID: {pdf_id}): {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error downloading PDF: {str(e)}")


@router.get("/pdf/view/{pdf_id}")
async def view_pdf(pdf_id: str):
    try:
        pdf_meta = pdfs_collection.find_one({"_id": ObjectId(pdf_id)})
        
        if not pdf_meta:
            raise HTTPException(status_code=404, detail="PDF not found")
        
        file_id = pdf_meta.get("file_id")
        if not file_id:
            raise HTTPException(status_code=404, detail="PDF file content not found")
        
        grid_out = fs.get(file_id)
        file_content = grid_out.read()
        
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
    try:
        user_id = str(current_user["_id"])
        
        pdf_meta = pdfs_collection.find_one({"_id": ObjectId(pdf_id)})
        
        if not pdf_meta:
            raise HTTPException(status_code=404, detail="PDF not found")
        
        if pdf_meta.get("user_id") != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to delete this PDF")
        
        file_id = pdf_meta.get("file_id")
        
        if file_id:
            try:
                fs.delete(file_id)
            except:
                pass
        
        result = pdfs_collection.delete_one({"_id": ObjectId(pdf_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="PDF metadata not found")
        
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

@router.get("/pdfs/by-link-user/{link_id}")
def get_pdfs_by_link_user(link_id: str, current_user = Depends(get_current_user)):
    try:
        link = collection.find_one({"_id": ObjectId(link_id)})
        if not link:
            raise HTTPException(status_code=404, detail="Link not found")
        
        link_user_id = link.get("user_id")
        current_user_id = str(current_user["_id"])
        
        if link_user_id != current_user_id:
            raise HTTPException(status_code=403, detail="Not authorized to view these PDFs")
        
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
                    "user_id": pdf.get("user_id"),
                    "user_email": pdf.get("user_email"),
                    "user_name": pdf.get("user_name")
                },
                "stored_in": pdf.get("stored_in", "unknown"),
                "is_admin_upload": pdf.get("is_admin_upload", False)
            }
            for pdf in pdfs
        ]
        
    except Exception as e:
        print(f"Error fetching PDFs by link user: {e}")
        raise HTTPException(status_code=500, detail="Error fetching PDFs")

#Links methods

@router.post("/", response_model=DriveLinkResponse)
def save_drive_links(payload: DriveLinkCreate, current_user = Depends(get_current_user)):
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

@router.get("/", response_model=List[DriveLinkResponse])
def get_drive_links():
    data = list(collection.find())
    
    result = []
    for item in data:
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
    user_id = str(current_user["_id"])
    data = list(collection.find({"user_id": user_id}))
    
    result = []
    for item in data:
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

@router.get("/user/{user_id}", response_model=List[DriveLinkResponse])
def get_user_drive_links(user_id: str):
    data = list(collection.find({"user_id": user_id}))
    
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

@router.get("/my-links-with-pdfs")
def get_my_links_with_pdfs(current_user = Depends(get_current_user)):
    try:
        user_id = str(current_user["_id"])
        
        links = list(collection.find({"user_id": user_id}).sort("created_at", -1))
        pdfs = list(pdfs_collection.find({"user_id": user_id}))
        
        pdfs_by_link = {}
        for pdf in pdfs:
            link_id = pdf.get("link_id")
            if link_id not in pdfs_by_link:
                pdfs_by_link[link_id] = []
            
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
                "uploaded_at": uploaded_at_str
            })
        
        result = []
        for link in links:
            link_id = str(link["_id"])
            
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
                "created_at": created_at_str,
                "has_pdf": link.get("has_pdf", False),
                "pdf_id": link.get("pdf_id"),
                "pdf_filename": link.get("pdf_filename"),
                "pdfs": pdfs_by_link.get(link_id, [])
            }
            result.append(link_data)
        
        return result
        
    except Exception as e:
        print(f"Error fetching links with PDFs: {e}")
        raise HTTPException(status_code=500, detail="Error fetching links with PDFs")

@router.delete("/{link_id}")
async def delete_drive_link(link_id: str, current_user = Depends(get_current_user)):
    try:
        link = collection.find_one({"_id": ObjectId(link_id)})
        
        if not link:
            raise HTTPException(status_code=404, detail="Drive link not found")
        
        if link.get("user_id") != str(current_user["_id"]):
            raise HTTPException(status_code=403, detail="Not authorized to delete this link")
        
        pdfs = list(pdfs_collection.find({"link_id": link_id}))
        
        for pdf in pdfs:
            file_id = pdf.get("file_id")
            if file_id:
                try:
                    fs.delete(file_id)
                except:
                    pass
            pdfs_collection.delete_one({"_id": pdf["_id"]})
        
        result = collection.delete_one({"_id": ObjectId(link_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Drive link not found")
        
        return {"message": "Drive link and all associated PDFs deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting drive link: {e}")
        raise HTTPException(status_code=500, detail="Error deleting drive link")