from fastapi import APIRouter, HTTPException
from app.models import Item
from app.database import db

router = APIRouter()
items_collection = db["items"]

# Get all items
@router.get("/items")
async def get_items():
    items = list(items_collection.find({}, {"_id": 0}))
    return items

# Create new item
@router.post("/items")
async def create_item(item: Item):
    item_dict = item.dict()
    result = items_collection.insert_one(item_dict)
    if result.inserted_id:
        return {"message": "Item created successfully"}
    raise HTTPException(status_code=500, detail="Item creation failed")
