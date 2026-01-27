# # from fastapi import APIRouter
# # from app.db import db
# # from datetime import datetime

# # router = APIRouter(prefix="/drive-links", tags=["Drive Links"])

# # collection = db["drive_links"]

# # @router.post("/")
# # def save_drive_links(payload: dict):
# #     print("POST PAYLOAD:", payload)

# #     document = {
# #         "drive_link_1": payload.get("drive_link_1"),
# #         "drive_link_2": payload.get("drive_link_2"),
# #         "created_at": datetime.utcnow()
# #     }

# #     result = collection.insert_one(document)

# #     print("INSERTED ID:", result.inserted_id)

# #     return {
# #         "message": "Drive links saved successfully",
# #         "id": str(result.inserted_id)
# #     }


# # @router.get("/")
# # def get_drive_links():
# #     data = list(collection.find())
# #     print("FETCH COUNT:", len(data))

# #     return [
# #         {
# #             "id": str(item["_id"]),
# #             "drive_link_1": item["drive_link_1"],
# #             "drive_link_2": item["drive_link_2"],
# #             "created_at": item["created_at"]
# #         }
# #         for item in data
# #     ]

# # from fastapi import APIRouter, Depends
# # from app.db import db
# # from datetime import datetime
# # from app.routes.auth import get_current_user

# # router = APIRouter(prefix="/drive-links", tags=["Drive Links"])

# # collection = db["drive_links"]

# # @router.post("/")
# # def save_drive_links(payload: dict, current_user = Depends(get_current_user)):
# #     print("POST PAYLOAD:", payload)
# #     print("USER:", current_user["email"])

# #     document = {
# #         "drive_link_1": payload.get("drive_link_1"),
# #         "drive_link_2": payload.get("drive_link_2"),
# #         "user_id": str(current_user["_id"]),  # Add user ID
# #         "user_email": current_user["email"],  # Add user email
# #         "user_name": f"{current_user['first_name']} {current_user['last_name']}",  # Add user name
# #         "created_at": datetime.utcnow()
# #     }

# #     result = collection.insert_one(document)

# #     print("INSERTED ID:", result.inserted_id)
# #     print("INSERTED BY:", current_user["email"])

# #     return {
# #         "message": "Drive links saved successfully",
# #         "id": str(result.inserted_id),
# #         "added_by": current_user["email"]
# #     }


# # @router.get("/")
# # def get_drive_links():
# #     data = list(collection.find())
# #     print("FETCH COUNT:", len(data))

# #     return [
# #         {
# #             "id": str(item["_id"]),
# #             "drive_link_1": item["drive_link_1"],
# #             "drive_link_2": item["drive_link_2"],
# #             "user_id": item["user_id"],
# #             "user_email": item["user_email"],
# #             "user_name": item["user_name"],
# #             "created_at": item["created_at"]
# #         }
# #         for item in data
# #     ]


# # @router.get("/my-links")
# # def get_my_drive_links(current_user = Depends(get_current_user)):
# #     """Get drive links added by current user only"""
# #     user_id = str(current_user["_id"])
# #     data = list(collection.find({"user_id": user_id}))
# #     print(f"FETCH COUNT for {current_user['email']}:", len(data))

# #     return [
# #         {
# #             "id": str(item["_id"]),
# #             "drive_link_1": item["drive_link_1"],
# #             "drive_link_2": item["drive_link_2"],
# #             "user_id": item["user_id"],
# #             "user_email": item["user_email"],
# #             "user_name": item["user_name"],
# #             "created_at": item["created_at"]
# #         }
# #         for item in data
# #     ]

# # # app/routes/drive_links.py - Add this new endpoint
# # @router.post("/generate-report")
# # def generate_comparison_report(payload: dict, current_user = Depends(get_current_user)):
# #     """Generate a comparison report between two Google Drive links"""
# #     print("GENERATE REPORT PAYLOAD:", payload)
# #     print("USER:", current_user["email"])
    
# #     link_id = payload.get("link_id")
# #     drive_link_1 = payload.get("drive_link_1")
# #     drive_link_2 = payload.get("drive_link_2")
    
# #     if not all([drive_link_1, drive_link_2]):
# #         return {"error": "Both drive links are required"}
    
# #     # In a real app, you would:
# #     # 1. Use Google Drive API to fetch file metadata
# #     # 2. Compare the files between the two links
# #     # 3. Generate actual statistics
    
# #     # For demo purposes, generate mock comparison data
# #     import random
# #     from datetime import datetime, timedelta
    
# #     # Mock file types with realistic extensions
# #     file_types = {
# #         "documents": [".pdf", ".doc", ".docx", ".txt", ".rtf", ".odt"],
# #         "spreadsheets": [".xls", ".xlsx", ".csv", ".ods"],
# #         "presentations": [".ppt", ".pptx", ".key", ".odp"],
# #         "images": [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg"],
# #         "videos": [".mp4", ".avi", ".mov", ".wmv", ".flv"],
# #         "audio": [".mp3", ".wav", ".aac", ".flac"],
# #         "archives": [".zip", ".rar", ".7z", ".tar.gz"],
# #         "code": [".py", ".js", ".html", ".css", ".java", ".cpp"]
# #     }
    
# #     # Generate mock files for link 1
# #     files_link1 = []
# #     files_link2 = []
    
# #     # Generate 5-15 files for each link
# #     num_files1 = random.randint(5, 15)
# #     num_files2 = random.randint(5, 15)
    
# #     # Common files that might appear in both links
# #     common_files = random.randint(2, min(num_files1, num_files2))
    
# #     # Generate common files
# #     common_file_names = []
# #     for i in range(common_files):
# #         file_type = random.choice(list(file_types.keys()))
# #         ext = random.choice(file_types[file_type])
# #         file_name = f"common_file_{i+1}{ext}"
# #         size = random.randint(1024, 10485760)  # 1KB to 10MB
# #         modified_date = datetime.now() - timedelta(days=random.randint(1, 30))
        
# #         common_file_names.append({
# #             "name": file_name,
# #             "type": file_type,
# #             "size": size,
# #             "modified": modified_date
# #         })
    
# #     # Generate unique files for link 1
# #     for i in range(num_files1):
# #         if i < len(common_file_names):
# #             files_link1.append(common_file_names[i])
# #         else:
# #             file_type = random.choice(list(file_types.keys()))
# #             ext = random.choice(file_types[file_type])
# #             file_name = f"unique1_file_{i+1}{ext}"
# #             size = random.randint(1024, 10485760)
# #             modified_date = datetime.now() - timedelta(days=random.randint(1, 30))
# #             files_link1.append({
# #                 "name": file_name,
# #                 "type": file_type,
# #                 "size": size,
# #                 "modified": modified_date
# #             })
    
# #     # Generate unique files for link 2
# #     for i in range(num_files2):
# #         if i < len(common_file_names):
# #             files_link2.append(common_file_names[i])
# #         else:
# #             file_type = random.choice(list(file_types.keys()))
# #             ext = random.choice(file_types[file_type])
# #             file_name = f"unique2_file_{i+1}{ext}"
# #             size = random.randint(1024, 10485760)
# #             modified_date = datetime.now() - timedelta(days=random.randint(1, 30))
# #             files_link2.append({
# #                 "name": file_name,
# #                 "type": file_type,
# #                 "size": size,
# #                 "modified": modified_date
# #             })
    
# #     # Calculate statistics
# #     total_size1 = sum(f["size"] for f in files_link1)
# #     total_size2 = sum(f["size"] for f in files_link2)
    
# #     # Count files by type
# #     type_counts1 = {}
# #     type_counts2 = {}
    
# #     for f in files_link1:
# #         type_counts1[f["type"]] = type_counts1.get(f["type"], 0) + 1
    
# #     for f in files_link2:
# #         type_counts2[f["type"]] = type_counts2.get(f["type"], 0) + 1
    
# #     # Find common files
# #     file_names1 = {f["name"] for f in files_link1}
# #     file_names2 = {f["name"] for f in files_link2}
# #     common_file_names_set = file_names1.intersection(file_names2)
    
# #     # Generate similarity score (0-100%)
# #     similarity_score = int((len(common_file_names_set) / max(len(files_link1), len(files_link2))) * 100)
    
# #     # Generate report
# #     report = {
# #         "report_id": f"REPORT-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
# #         "generated_at": datetime.utcnow(),
# #         "generated_by": current_user["email"],
# #         "link_id": link_id,
# #         "drive_link_1": drive_link_1,
# #         "drive_link_2": drive_link_2,
# #         "comparison_summary": {
# #             "similarity_score": similarity_score,
# #             "total_files_link1": len(files_link1),
# #             "total_files_link2": len(files_link2),
# #             "common_files": len(common_file_names_set),
# #             "unique_to_link1": len(files_link1) - len(common_file_names_set),
# #             "unique_to_link2": len(files_link2) - len(common_file_names_set),
# #             "total_size_link1": f"{total_size1 / 1024 / 1024:.2f} MB",
# #             "total_size_link2": f"{total_size2 / 1024 / 1024:.2f} MB",
# #             "size_difference": f"{abs(total_size1 - total_size2) / 1024 / 1024:.2f} MB"
# #         },
# #         "file_type_analysis": {
# #             "link1": type_counts1,
# #             "link2": type_counts2
# #         },
# #         "common_files": list(common_file_names_set),
# #         "unique_files_link1": [f["name"] for f in files_link1 if f["name"] not in common_file_names_set],
# #         "unique_files_link2": [f["name"] for f in files_link2 if f["name"] not in common_file_names_set],
# #         "file_details": {
# #             "link1": [
# #                 {
# #                     "name": f["name"],
# #                     "type": f["type"],
# #                     "size": f"{f['size'] / 1024:.2f} KB",
# #                     "modified": f["modified"].isoformat()
# #                 }
# #                 for f in files_link1[:10]  # Show first 10 files
# #             ],
# #             "link2": [
# #                 {
# #                     "name": f["name"],
# #                     "type": f["type"],
# #                     "size": f"{f['size'] / 1024:.2f} KB",
# #                     "modified": f["modified"].isoformat()
# #                 }
# #                 for f in files_link2[:10]
# #             ]
# #         },
# #         "recommendations": [
# #             "Consider merging duplicate files" if similarity_score > 50 else "Files are mostly unique",
# #             f"Link 1 has more {max(type_counts1, key=type_counts1.get)} files" if type_counts1 else "",
# #             f"Link 2 has more {max(type_counts2, key=type_counts2.get)} files" if type_counts2 else "",
# #             "Both links contain recent files" if any('2024' in str(f.get('modified', '')) for f in files_link1 + files_link2) else "Some files are older"
# #         ]
# #     }
    
# #     # Save report to database (optional)
# #     report_doc = {
# #         **report,
# #         "user_id": str(current_user["_id"]),
# #         "user_email": current_user["email"],
# #         "user_name": f"{current_user['first_name']} {current_user['last_name']}"
# #     }
    
# #     # You could create a separate collection for reports
# #     # reports_collection = db["drive_reports"]
# #     # result = reports_collection.insert_one(report_doc)
# #     # report["report_db_id"] = str(result.inserted_id)
    
# #     print(f"Report generated for {current_user['email']}")
# #     print(f"Similarity: {similarity_score}%")
    
# #     return {
# #         "message": "Comparison report generated successfully",
# #         "report": report
# #     }
# # @router.get("/user/{user_id}")
# # def get_user_drive_links(user_id: str):
# #     """Get drive links for a specific user"""
# #     data = list(collection.find({"user_id": user_id}))
# #     print(f"FETCH COUNT for user {user_id}:", len(data))

# #     return [
# #         {
# #             "id": str(item["_id"]),
# #             "drive_link_1": item["drive_link_1"],
# #             "drive_link_2": item["drive_link_2"],
# #             "user_id": item["user_id"],
# #             "user_email": item["user_email"],
# #             "user_name": item["user_name"],
# #             "created_at": item["created_at"]
# #         }
# #         for item in data
# #     ]

# from fastapi import APIRouter, Depends, HTTPException
# from app.db import db
# from datetime import datetime
# from app.routes.auth import get_current_user
# from app.models.drive_links import DriveLinkCreate, DriveLinkResponse, ReportGenerateRequest, ReportResponse
# from typing import List
# from bson import ObjectId

# router = APIRouter(prefix="/drive-links", tags=["Drive Links"])
# collection = db["drive_links"]
# reports_collection = db["drive_reports"]


# # ✅ Updated: Include user dependency to get actual user data
# @router.post("/", response_model=DriveLinkResponse)
# def save_drive_links(payload: DriveLinkCreate, current_user = Depends(get_current_user)):
#     print("POST PAYLOAD:", payload)
#     print("CURRENT USER:", current_user)

#     # Save actual user information
#     document = {
#         "drive_link_1": payload.drive_link_1,
#         "drive_link_2": payload.drive_link_2,
#         "user_id": str(current_user["_id"]),  # Actual user ID
#         "user_email": current_user["email"],  # Actual user email
#         "user_name": f"{current_user.get('first_name', '')} {current_user.get('last_name', '')}".strip(),  # Actual user name
#         "created_at": datetime.utcnow()
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
#         created_at=document["created_at"]
#     )


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
#             created_at=item.get("created_at", datetime.utcnow())
#         )
#         for item in data
#     ]

# @router.get("/my-links", response_model=List[DriveLinkResponse])
# def get_my_drive_links(current_user = Depends(get_current_user)):
#     """Get drive links added by current user only"""
#     user_id = str(current_user["_id"])
#     data = list(collection.find({"user_id": user_id}))
#     print(f"FETCH COUNT for {current_user['email']}:", len(data))

#     return [
#         DriveLinkResponse(
#             id=str(item["_id"]),
#             drive_link_1=item["drive_link_1"],
#             drive_link_2=item["drive_link_2"],
#             user_id=item["user_id"],
#             user_email=item["user_email"],
#             user_name=item["user_name"],
#             created_at=item["created_at"]
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
#             drive_link_1=item["drive_link_1"],
#             drive_link_2=item["drive_link_2"],
#             user_id=item["user_id"],
#             user_email=item["user_email"],
#             user_name=item["user_name"],
#             created_at=item["created_at"]
#         )
#         for item in data
#     ]

# @router.post("/generate-report", response_model=ReportResponse)
# def generate_comparison_report(payload: ReportGenerateRequest, current_user = Depends(get_current_user)):
#     """Generate a comparison report between two Google Drive links"""
#     print("GENERATE REPORT PAYLOAD:", payload)
#     print("USER:", current_user["email"])
    
   
#     import random
#     from datetime import timedelta
    
   
#     file_types = {
#         "documents": [".pdf", ".doc", ".docx", ".txt", ".rtf", ".odt"],
#         "spreadsheets": [".xls", ".xlsx", ".csv", ".ods"],
#         "presentations": [".ppt", ".pptx", ".key", ".odp"],
#         "images": [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg"],
#         "videos": [".mp4", ".avi", ".mov", ".wmv", ".flv"],
#         "audio": [".mp3", ".wav", ".aac", ".flac"],
#         "archives": [".zip", ".rar", ".7z", ".tar.gz"],
#         "code": [".py", ".js", ".html", ".css", ".java", ".cpp"]
#     }
    
    
#     files_link1 = []
#     files_link2 = []
  
#     num_files1 = random.randint(5, 15)
#     num_files2 = random.randint(5, 15)
    
  
#     common_files = random.randint(2, min(num_files1, num_files2))
    
   
#     common_file_names = []
#     for i in range(common_files):
#         file_type = random.choice(list(file_types.keys()))
#         ext = random.choice(file_types[file_type])
#         file_name = f"common_file_{i+1}{ext}"
#         size = random.randint(1024, 10485760)  
#         modified_date = datetime.utcnow() - timedelta(days=random.randint(1, 30))
        
#         common_file_names.append({
#             "name": file_name,
#             "type": file_type,
#             "size": size,
#             "modified": modified_date
#         })
    
  
#     for i in range(num_files1):
#         if i < len(common_file_names):
#             files_link1.append(common_file_names[i])
#         else:
#             file_type = random.choice(list(file_types.keys()))
#             ext = random.choice(file_types[file_type])
#             file_name = f"unique1_file_{i+1}{ext}"
#             size = random.randint(1024, 10485760)
#             modified_date = datetime.utcnow() - timedelta(days=random.randint(1, 30))
#             files_link1.append({
#                 "name": file_name,
#                 "type": file_type,
#                 "size": size,
#                 "modified": modified_date
#             })
    
  
#     for i in range(num_files2):
#         if i < len(common_file_names):
#             files_link2.append(common_file_names[i])
#         else:
#             file_type = random.choice(list(file_types.keys()))
#             ext = random.choice(file_types[file_type])
#             file_name = f"unique2_file_{i+1}{ext}"
#             size = random.randint(1024, 10485760)
#             modified_date = datetime.utcnow() - timedelta(days=random.randint(1, 30))
#             files_link2.append({
#                 "name": file_name,
#                 "type": file_type,
#                 "size": size,
#                 "modified": modified_date
#             })
    
   
#     total_size1 = sum(f["size"] for f in files_link1)
#     total_size2 = sum(f["size"] for f in files_link2)
    
   
#     type_counts1 = {}
#     type_counts2 = {}
    
#     for f in files_link1:
#         type_counts1[f["type"]] = type_counts1.get(f["type"], 0) + 1
    
#     for f in files_link2:
#         type_counts2[f["type"]] = type_counts2.get(f["type"], 0) + 1
    
   
#     file_names1 = {f["name"] for f in files_link1}
#     file_names2 = {f["name"] for f in files_link2}
#     common_file_names_set = file_names1.intersection(file_names2)
    
  
#     similarity_score = int((len(common_file_names_set) / max(len(files_link1), len(files_link2))) * 100)
    
   
#     report = ReportResponse(
#         report_id=f"REPORT-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
#         generated_at=datetime.utcnow(),
#         generated_by=current_user["email"],
#         link_id=payload.link_id,
#         drive_link_1=payload.drive_link_1,
#         drive_link_2=payload.drive_link_2,
#         comparison_summary={
#             "similarity_score": similarity_score,
#             "total_files_link1": len(files_link1),
#             "total_files_link2": len(files_link2),
#             "common_files": len(common_file_names_set),
#             "unique_to_link1": len(files_link1) - len(common_file_names_set),
#             "unique_to_link2": len(files_link2) - len(common_file_names_set),
#             "total_size_link1": f"{total_size1 / 1024 / 1024:.2f} MB",
#             "total_size_link2": f"{total_size2 / 1024 / 1024:.2f} MB",
#             "size_difference": f"{abs(total_size1 - total_size2) / 1024 / 1024:.2f} MB"
#         },
#         file_type_analysis={
#             "link1": type_counts1,
#             "link2": type_counts2
#         },
#         common_files=list(common_file_names_set),
#         unique_files_link1=[f["name"] for f in files_link1 if f["name"] not in common_file_names_set],
#         unique_files_link2=[f["name"] for f in files_link2 if f["name"] not in common_file_names_set],
#         file_details={
#             "link1": [
#                 {
#                     "name": f["name"],
#                     "type": f["type"],
#                     "size": f"{f['size'] / 1024:.2f} KB",
#                     "modified": f["modified"].isoformat()
#                 }
#                 for f in files_link1[:10]  # Show first 10 files
#             ],
#             "link2": [
#                 {
#                     "name": f["name"],
#                     "type": f["type"],
#                     "size": f"{f['size'] / 1024:.2f} KB",
#                     "modified": f["modified"].isoformat()
#                 }
#                 for f in files_link2[:10]
#             ]
#         },
#         recommendations=[
#             "Consider merging duplicate files" if similarity_score > 50 else "Files are mostly unique",
#             f"Link 1 has more {max(type_counts1, key=type_counts1.get)} files" if type_counts1 else "",
#             f"Link 2 has more {max(type_counts2, key=type_counts2.get)} files" if type_counts2 else "",
#             "Both links contain recent files" if any('2024' in str(f.get('modified', '')) for f in files_link1 + files_link2) else "Some files are older"
#         ]
#     )
    
#     print(f"Report generated for {current_user['email']}")
#     print(f"Similarity: {similarity_score}%")
    
#     return report


from fastapi import APIRouter, Depends, HTTPException
from app.db import db
from datetime import datetime
from app.routes.auth import get_current_user
from app.models.drive_links import DriveLinkCreate, DriveLinkResponse, ReportGenerateRequest, ReportResponse
from typing import List
from bson import ObjectId

router = APIRouter(prefix="/drive-links", tags=["Drive Links"])
collection = db["drive_links"]
reports_collection = db["drive_reports"]


# ✅ Updated: Include user dependency to get actual user data
@router.post("/", response_model=DriveLinkResponse)
def save_drive_links(payload: DriveLinkCreate, current_user = Depends(get_current_user)):
    print("POST PAYLOAD:", payload)
    print("CURRENT USER:", current_user)

    # Save actual user information
    document = {
        "drive_link_1": payload.drive_link_1,
        "drive_link_2": payload.drive_link_2,
        "user_id": str(current_user["_id"]),  # Actual user ID
        "user_email": current_user["email"],  # Actual user email
        "user_name": f"{current_user.get('first_name', '')} {current_user.get('last_name', '')}".strip(),  # Actual user name
        "created_at": datetime.utcnow()
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
        created_at=document["created_at"]
    )


@router.get("/", response_model=List[DriveLinkResponse])
def get_drive_links():
    data = list(collection.find())
    print("FETCH COUNT:", len(data))

   
    return [
        DriveLinkResponse(
            id=str(item["_id"]),
            drive_link_1=item.get("drive_link_1", ""),
            drive_link_2=item.get("drive_link_2", ""),
            user_id=item.get("user_id", ""),
            user_email=item.get("user_email", ""),
            user_name=item.get("user_name", ""),
            created_at=item.get("created_at", datetime.utcnow())
        )
        for item in data
    ]

@router.get("/my-links", response_model=List[DriveLinkResponse])
def get_my_drive_links(current_user = Depends(get_current_user)):
    """Get drive links added by current user only"""
    user_id = str(current_user["_id"])
    data = list(collection.find({"user_id": user_id}))
    print(f"FETCH COUNT for {current_user['email']}:", len(data))

    return [
        DriveLinkResponse(
            id=str(item["_id"]),
            drive_link_1=item["drive_link_1"],
            drive_link_2=item["drive_link_2"],
            user_id=item["user_id"],
            user_email=item["user_email"],
            user_name=item["user_name"],
            created_at=item["created_at"]
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
            drive_link_1=item["drive_link_1"],
            drive_link_2=item["drive_link_2"],
            user_id=item["user_id"],
            user_email=item["user_email"],
            user_name=item["user_name"],
            created_at=item["created_at"]
        )
        for item in data
    ]

@router.post("/generate-report", response_model=ReportResponse)
def generate_comparison_report(payload: ReportGenerateRequest, current_user = Depends(get_current_user)):
    """Generate a comparison report between two Google Drive links"""
    print("GENERATE REPORT PAYLOAD:", payload)
    print("USER:", current_user["email"])
    
    # Check if links exist in the database
    link_exists = collection.find_one({"_id": ObjectId(payload.link_id)})
    if not link_exists:
        raise HTTPException(status_code=404, detail="Drive link not found")
    
    import random
    from datetime import timedelta
    
    file_types = {
        "documents": [".pdf", ".doc", ".docx", ".txt", ".rtf", ".odt"],
        "spreadsheets": [".xls", ".xlsx", ".csv", ".ods"],
        "presentations": [".ppt", ".pptx", ".key", ".odp"],
        "images": [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg"],
        "videos": [".mp4", ".avi", ".mov", ".wmv", ".flv"],
        "audio": [".mp3", ".wav", ".aac", ".flac"],
        "archives": [".zip", ".rar", ".7z", ".tar.gz"],
        "code": [".py", ".js", ".html", ".css", ".java", ".cpp"]
    }
    
    # Generate mock files
    files_link1 = []
    files_link2 = []
    
    num_files1 = random.randint(5, 15)
    num_files2 = random.randint(5, 15)
    
    common_files = random.randint(2, min(num_files1, num_files2))
    
    # Generate common files
    common_file_names = []
    for i in range(common_files):
        file_type = random.choice(list(file_types.keys()))
        ext = random.choice(file_types[file_type])
        file_name = f"common_file_{i+1}{ext}"
        size = random.randint(1024, 10485760)  
        modified_date = datetime.utcnow() - timedelta(days=random.randint(1, 30))
        
        common_file_names.append({
            "name": file_name,
            "type": file_type,
            "size": size,
            "modified": modified_date
        })
    
    # Generate files for link 1
    for i in range(num_files1):
        if i < len(common_file_names):
            files_link1.append(common_file_names[i])
        else:
            file_type = random.choice(list(file_types.keys()))
            ext = random.choice(file_types[file_type])
            file_name = f"unique1_file_{i+1}{ext}"
            size = random.randint(1024, 10485760)
            modified_date = datetime.utcnow() - timedelta(days=random.randint(1, 30))
            files_link1.append({
                "name": file_name,
                "type": file_type,
                "size": size,
                "modified": modified_date
            })
    
    # Generate files for link 2
    for i in range(num_files2):
        if i < len(common_file_names):
            files_link2.append(common_file_names[i])
        else:
            file_type = random.choice(list(file_types.keys()))
            ext = random.choice(file_types[file_type])
            file_name = f"unique2_file_{i+1}{ext}"
            size = random.randint(1024, 10485760)
            modified_date = datetime.utcnow() - timedelta(days=random.randint(1, 30))
            files_link2.append({
                "name": file_name,
                "type": file_type,
                "size": size,
                "modified": modified_date
            })
    
    # Calculate statistics
    total_size1 = sum(f["size"] for f in files_link1)
    total_size2 = sum(f["size"] for f in files_link2)
    
    # Count files by type
    type_counts1 = {}
    type_counts2 = {}
    
    for f in files_link1:
        type_counts1[f["type"]] = type_counts1.get(f["type"], 0) + 1
    
    for f in files_link2:
        type_counts2[f["type"]] = type_counts2.get(f["type"], 0) + 1
    
    # Find common files
    file_names1 = {f["name"] for f in files_link1}
    file_names2 = {f["name"] for f in files_link2}
    common_file_names_set = file_names1.intersection(file_names2)
    
    # Generate similarity score
    similarity_score = int((len(common_file_names_set) / max(len(files_link1), len(files_link2))) * 100)
    
    # Filter recommendations to remove empty strings
    recommendations = [
        "Consider merging duplicate files" if similarity_score > 50 else "Files are mostly unique",
        f"Link 1 has more {max(type_counts1, key=type_counts1.get)} files" if type_counts1 else None,
        f"Link 2 has more {max(type_counts2, key=type_counts2.get)} files" if type_counts2 else None,
        "Both links contain recent files" if any('2024' in str(f.get('modified', '')) for f in files_link1 + files_link2) else "Some files are older"
    ]
    
    # Remove None values
    recommendations = [rec for rec in recommendations if rec is not None]
    
    # Create report response
    report = ReportResponse(
        report_id=f"REPORT-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
        generated_at=datetime.utcnow(),
        generated_by=current_user["email"],
        link_id=payload.link_id,
        drive_link_1=payload.drive_link_1,
        drive_link_2=payload.drive_link_2,
        comparison_summary={
            "similarity_score": similarity_score,
            "total_files_link1": len(files_link1),
            "total_files_link2": len(files_link2),
            "common_files": len(common_file_names_set),
            "unique_to_link1": len(files_link1) - len(common_file_names_set),
            "unique_to_link2": len(files_link2) - len(common_file_names_set),
            "total_size_link1": f"{total_size1 / 1024 / 1024:.2f} MB",
            "total_size_link2": f"{total_size2 / 1024 / 1024:.2f} MB",
            "size_difference": f"{abs(total_size1 - total_size2) / 1024 / 1024:.2f} MB"
        },
        file_type_analysis={
            "link1": type_counts1,
            "link2": type_counts2
        },
        common_files=list(common_file_names_set),
        unique_files_link1=[f["name"] for f in files_link1 if f["name"] not in common_file_names_set],
        unique_files_link2=[f["name"] for f in files_link2 if f["name"] not in common_file_names_set],
        file_details={
            "link1": [
                {
                    "name": f["name"],
                    "type": f["type"],
                    "size": f"{f['size'] / 1024:.2f} KB",
                    "modified": f["modified"].isoformat()
                }
                for f in files_link1[:10]
            ],
            "link2": [
                {
                    "name": f["name"],
                    "type": f["type"],
                    "size": f"{f['size'] / 1024:.2f} KB",
                    "modified": f["modified"].isoformat()
                }
                for f in files_link2[:10]
            ]
        },
        recommendations=recommendations
    )
    
    # ✅ SAVE REPORT TO DATABASE
    report_document = {
        "report_id": report.report_id,
        "generated_at": report.generated_at,
        "generated_by": report.generated_by,
        "link_id": report.link_id,
        "drive_link_1": report.drive_link_1,
        "drive_link_2": report.drive_link_2,
        "comparison_summary": report.comparison_summary,
        "file_type_analysis": report.file_type_analysis,
        "common_files": report.common_files,
        "unique_files_link1": report.unique_files_link1,
        "unique_files_link2": report.unique_files_link2,
        "file_details": report.file_details,
        "recommendations": report.recommendations,
        "user_id": str(current_user["_id"]),
        "user_email": current_user["email"],
        "user_name": f"{current_user.get('first_name', '')} {current_user.get('last_name', '')}".strip(),
        "created_at": datetime.utcnow()
    }
    
    # Insert report into MongoDB
    try:
        result = reports_collection.insert_one(report_document)
        print(f"✅ Report saved to database with ID: {result.inserted_id}")
    except Exception as e:
        print(f"⚠️ Error saving report to database: {e}")
        # Still return the report even if saving fails
    
    print(f"Report generated for {current_user['email']}")
    print(f"Similarity: {similarity_score}%")
    
    return report


# ✅ NEW: Get all saved reports
@router.get("/reports", response_model=List[ReportResponse])
def get_all_reports():
    """Get all saved comparison reports"""
    try:
        reports = list(reports_collection.find().sort("generated_at", -1))
        print(f"Found {len(reports)} saved reports")
        
        return [
            ReportResponse(
                report_id=report.get("report_id", ""),
                generated_at=report.get("generated_at", datetime.utcnow()),
                generated_by=report.get("generated_by", ""),
                link_id=report.get("link_id", ""),
                drive_link_1=report.get("drive_link_1", ""),
                drive_link_2=report.get("drive_link_2", ""),
                comparison_summary=report.get("comparison_summary", {}),
                file_type_analysis=report.get("file_type_analysis", {}),
                common_files=report.get("common_files", []),
                unique_files_link1=report.get("unique_files_link1", []),
                unique_files_link2=report.get("unique_files_link2", []),
                file_details=report.get("file_details", {}),
                recommendations=report.get("recommendations", [])
            )
            for report in reports
        ]
    except Exception as e:
        print(f"Error fetching reports: {e}")
        raise HTTPException(status_code=500, detail="Error fetching reports")


# ✅ NEW: Get reports for current user
@router.get("/reports/my-reports", response_model=List[ReportResponse])
def get_my_reports(current_user = Depends(get_current_user)):
    """Get comparison reports generated by current user"""
    try:
        user_id = str(current_user["_id"])
        reports = list(reports_collection.find({"user_id": user_id}).sort("generated_at", -1))
        print(f"Found {len(reports)} reports for user {current_user['email']}")
        
        return [
            ReportResponse(
                report_id=report.get("report_id", ""),
                generated_at=report.get("generated_at", datetime.utcnow()),
                generated_by=report.get("generated_by", ""),
                link_id=report.get("link_id", ""),
                drive_link_1=report.get("drive_link_1", ""),
                drive_link_2=report.get("drive_link_2", ""),
                comparison_summary=report.get("comparison_summary", {}),
                file_type_analysis=report.get("file_type_analysis", {}),
                common_files=report.get("common_files", []),
                unique_files_link1=report.get("unique_files_link1", []),
                unique_files_link2=report.get("unique_files_link2", []),
                file_details=report.get("file_details", {}),
                recommendations=report.get("recommendations", [])
            )
            for report in reports
        ]
    except Exception as e:
        print(f"Error fetching user reports: {e}")
        raise HTTPException(status_code=500, detail="Error fetching your reports")


# ✅ NEW: Get a single report by ID
@router.get("/reports/{report_id}", response_model=ReportResponse)
def get_report_by_id(report_id: str):
    """Get a specific report by its ID"""
    try:
        # Try to find by report_id field first
        report = reports_collection.find_one({"report_id": report_id})
        
        # If not found, try by MongoDB _id
        if not report:
            try:
                report = reports_collection.find_one({"_id": ObjectId(report_id)})
            except:
                pass
        
        if not report:
            raise HTTPException(status_code=404, detail="Report not found")
        
        return ReportResponse(
            report_id=report.get("report_id", ""),
            generated_at=report.get("generated_at", datetime.utcnow()),
            generated_by=report.get("generated_by", ""),
            link_id=report.get("link_id", ""),
            drive_link_1=report.get("drive_link_1", ""),
            drive_link_2=report.get("drive_link_2", ""),
            comparison_summary=report.get("comparison_summary", {}),
            file_type_analysis=report.get("file_type_analysis", {}),
            common_files=report.get("common_files", []),
            unique_files_link1=report.get("unique_files_link1", []),
            unique_files_link2=report.get("unique_files_link2", []),
            file_details=report.get("file_details", {}),
            recommendations=report.get("recommendations", [])
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching report: {e}")
        raise HTTPException(status_code=500, detail="Error fetching report")


# ✅ NEW: Get reports for a specific drive link
@router.get("/reports/link/{link_id}", response_model=List[ReportResponse])
def get_reports_for_link(link_id: str):
    """Get all reports generated for a specific drive link"""
    try:
        reports = list(reports_collection.find({"link_id": link_id}).sort("generated_at", -1))
        print(f"Found {len(reports)} reports for link {link_id}")
        
        return [
            ReportResponse(
                report_id=report.get("report_id", ""),
                generated_at=report.get("generated_at", datetime.utcnow()),
                generated_by=report.get("generated_by", ""),
                link_id=report.get("link_id", ""),
                drive_link_1=report.get("drive_link_1", ""),
                drive_link_2=report.get("drive_link_2", ""),
                comparison_summary=report.get("comparison_summary", {}),
                file_type_analysis=report.get("file_type_analysis", {}),
                common_files=report.get("common_files", []),
                unique_files_link1=report.get("unique_files_link1", []),
                unique_files_link2=report.get("unique_files_link2", []),
                file_details=report.get("file_details", {}),
                recommendations=report.get("recommendations", [])
            )
            for report in reports
        ]
    except Exception as e:
        print(f"Error fetching link reports: {e}")
        raise HTTPException(status_code=500, detail="Error fetching reports for this link")


# ✅ NEW: Delete a report
@router.delete("/reports/{report_id}")
def delete_report(report_id: str, current_user = Depends(get_current_user)):
    """Delete a report (only if user is the owner)"""
    try:
        # Find the report
        report = reports_collection.find_one({"report_id": report_id})
        
        # If not found by report_id, try by _id
        if not report:
            try:
                report = reports_collection.find_one({"_id": ObjectId(report_id)})
            except:
                pass
        
        if not report:
            raise HTTPException(status_code=404, detail="Report not found")
        
        # Check if user is the owner
        if report.get("user_id") != str(current_user["_id"]):
            raise HTTPException(status_code=403, detail="Not authorized to delete this report")
        
        # Delete the report
        result = reports_collection.delete_one({"_id": report["_id"]})
        
        if result.deleted_count == 1:
            return {"message": "Report deleted successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to delete report")
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting report: {e}")
        raise HTTPException(status_code=500, detail="Error deleting report")


# ✅ NEW: Get report statistics
@router.get("/reports/stats")
def get_report_statistics(current_user = Depends(get_current_user)):
    """Get statistics about reports"""
    try:
        user_id = str(current_user["_id"])
        
        # Total reports count
        total_reports = reports_collection.count_documents({})
        user_reports = reports_collection.count_documents({"user_id": user_id})
        
        # Recent reports (last 7 days)
        week_ago = datetime.utcnow() - timedelta(days=7)
        recent_reports = reports_collection.count_documents({
            "generated_at": {"$gte": week_ago}
        })
        
        # Most common link
        pipeline = [
            {"$group": {"_id": "$link_id", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 1}
        ]
        most_analyzed = list(reports_collection.aggregate(pipeline))
        
        most_analyzed_link = most_analyzed[0]["_id"] if most_analyzed else None
        most_analyzed_count = most_analyzed[0]["count"] if most_analyzed else 0
        
        return {
            "total_reports": total_reports,
            "user_reports": user_reports,
            "recent_reports": recent_reports,
            "most_analyzed_link": most_analyzed_link,
            "most_analyzed_count": most_analyzed_count
        }
    except Exception as e:
        print(f"Error getting report stats: {e}")
        raise HTTPException(status_code=500, detail="Error getting report statistics")