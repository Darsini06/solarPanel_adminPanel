# from fastapi import APIRouter
# from app.db import db
# from datetime import datetime

# router = APIRouter(prefix="/drive-links", tags=["Drive Links"])

# collection = db["drive_links"]

# @router.post("/")
# def save_drive_links(payload: dict):
#     print("POST PAYLOAD:", payload)

#     document = {
#         "drive_link_1": payload.get("drive_link_1"),
#         "drive_link_2": payload.get("drive_link_2"),
#         "created_at": datetime.utcnow()
#     }

#     result = collection.insert_one(document)

#     print("INSERTED ID:", result.inserted_id)

#     return {
#         "message": "Drive links saved successfully",
#         "id": str(result.inserted_id)
#     }


# @router.get("/")
# def get_drive_links():
#     data = list(collection.find())
#     print("FETCH COUNT:", len(data))

#     return [
#         {
#             "id": str(item["_id"]),
#             "drive_link_1": item["drive_link_1"],
#             "drive_link_2": item["drive_link_2"],
#             "created_at": item["created_at"]
#         }
#         for item in data
#     ]

from fastapi import APIRouter, Depends
from app.db import db
from datetime import datetime
from app.routes.auth import get_current_user

router = APIRouter(prefix="/drive-links", tags=["Drive Links"])

collection = db["drive_links"]

@router.post("/")
def save_drive_links(payload: dict, current_user = Depends(get_current_user)):
    print("POST PAYLOAD:", payload)
    print("USER:", current_user["email"])

    document = {
        "drive_link_1": payload.get("drive_link_1"),
        "drive_link_2": payload.get("drive_link_2"),
        "user_id": str(current_user["_id"]),  # Add user ID
        "user_email": current_user["email"],  # Add user email
        "user_name": f"{current_user['first_name']} {current_user['last_name']}",  # Add user name
        "created_at": datetime.utcnow()
    }

    result = collection.insert_one(document)

    print("INSERTED ID:", result.inserted_id)
    print("INSERTED BY:", current_user["email"])

    return {
        "message": "Drive links saved successfully",
        "id": str(result.inserted_id),
        "added_by": current_user["email"]
    }


@router.get("/")
def get_drive_links():
    data = list(collection.find())
    print("FETCH COUNT:", len(data))

    return [
        {
            "id": str(item["_id"]),
            "drive_link_1": item["drive_link_1"],
            "drive_link_2": item["drive_link_2"],
            "user_id": item["user_id"],
            "user_email": item["user_email"],
            "user_name": item["user_name"],
            "created_at": item["created_at"]
        }
        for item in data
    ]


@router.get("/my-links")
def get_my_drive_links(current_user = Depends(get_current_user)):
    """Get drive links added by current user only"""
    user_id = str(current_user["_id"])
    data = list(collection.find({"user_id": user_id}))
    print(f"FETCH COUNT for {current_user['email']}:", len(data))

    return [
        {
            "id": str(item["_id"]),
            "drive_link_1": item["drive_link_1"],
            "drive_link_2": item["drive_link_2"],
            "user_id": item["user_id"],
            "user_email": item["user_email"],
            "user_name": item["user_name"],
            "created_at": item["created_at"]
        }
        for item in data
    ]


@router.get("/user/{user_id}")
def get_user_drive_links(user_id: str):
    """Get drive links for a specific user"""
    data = list(collection.find({"user_id": user_id}))
    print(f"FETCH COUNT for user {user_id}:", len(data))

    return [
        {
            "id": str(item["_id"]),
            "drive_link_1": item["drive_link_1"],
            "drive_link_2": item["drive_link_2"],
            "user_id": item["user_id"],
            "user_email": item["user_email"],
            "user_name": item["user_name"],
            "created_at": item["created_at"]
        }
        for item in data
    ]