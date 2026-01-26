from fastapi import APIRouter
from app.db import db
from datetime import datetime

router = APIRouter(prefix="/drive-links", tags=["Drive Links"])

collection = db["drive_links"]

@router.post("/")
def save_drive_links(payload: dict):
    print("POST PAYLOAD:", payload)

    document = {
        "drive_link_1": payload.get("drive_link_1"),
        "drive_link_2": payload.get("drive_link_2"),
        "created_at": datetime.utcnow()
    }

    result = collection.insert_one(document)

    print("INSERTED ID:", result.inserted_id)

    return {
        "message": "Drive links saved successfully",
        "id": str(result.inserted_id)
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
            "created_at": item["created_at"]
        }
        for item in data
    ]
