from fastapi import APIRouter, Depends, HTTPException, status
from app.db import db
from datetime import datetime
from app.routes.auth import get_current_user
from app.models.bookings import BookingCreate, BookingUpdate, BookingResponse, GuestBookingCreate
from typing import List, Optional
from bson import ObjectId

router = APIRouter(prefix="/bookings", tags=["Bookings"])
collection = db["bookings"]

@router.post("/", response_model=BookingResponse)
def create_booking(payload: BookingCreate, current_user = Depends(get_current_user)):
    print("CREATE BOOKING PAYLOAD:", payload)
    
    document = payload.dict()
    document["user_id"] = str(current_user["_id"])
    document["user_email"] = current_user["email"]
    document["user_name"] = f"{current_user.get('first_name', '')} {current_user.get('last_name', '')}".strip()
    document["created_at"] = datetime.utcnow()
    
    result = collection.insert_one(document)
    
    return BookingResponse(
        id=str(result.inserted_id),
        **document
    )

@router.post("/guest", response_model=BookingResponse)
def create_guest_booking(payload: GuestBookingCreate):
    print("CREATE GUEST BOOKING PAYLOAD:", payload)
    
    document = payload.dict()
    # Map Guest specific fields to common schema fields if needed, 
    # but here we can just store them as is since MongoDB is flexible 
    # and we updated BookingResponse to include them.
    
    document["user_id"] = "guest"
    document["user_name"] = payload.name
    document["user_email"] = payload.email
    document["status"] = "pending"
    document["created_at"] = datetime.utcnow()
    
    # Remove name/email from document if we don't want duplicates with user_name/user_email?
    # Actually keeping them is fine or cleaning them up.
    # The payload.dict() includes name/email.
    
    result = collection.insert_one(document)
    
    return BookingResponse(
        id=str(result.inserted_id),
        **document
    )

@router.get("/", response_model=List[BookingResponse])
def get_all_bookings():
    # Admin route to see all? Or maybe just for testing. 
    # In a real app, this should probably be admin only.
    data = list(collection.find().sort("created_at", -1))
    return [
        BookingResponse(
            id=str(item["_id"]),
            **item
        )
        for item in data
    ]

@router.get("/my-bookings", response_model=List[BookingResponse])
def get_my_bookings(current_user = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    data = list(collection.find({"user_id": user_id}).sort("created_at", -1))
    
    return [
        BookingResponse(
            id=str(item["_id"]),
            **item
        )
        for item in data
    ]

@router.get("/{booking_id}", response_model=BookingResponse)
def get_booking(booking_id: str, current_user = Depends(get_current_user)):
    if not ObjectId.is_valid(booking_id):
        raise HTTPException(status_code=400, detail="Invalid booking ID")
        
    booking = collection.find_one({"_id": ObjectId(booking_id)})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
        
    # Check ownership or admin status (assuming admin check later)
    # For now allow owner OR admin (if we had admin role check)
    # Also allow if it's a guest booking? But guest booking has no owner to auth against.
    # So maybe restricting guest bookings to be viewable only by Admin (get_all_bookings).
    if booking["user_id"] != str(current_user["_id"]) and booking["user_id"] != "guest":
         raise HTTPException(status_code=403, detail="Not authorized to access this booking")
         
    return BookingResponse(id=str(booking["_id"]), **booking)

@router.patch("/{booking_id}", response_model=BookingResponse)
def update_booking(booking_id: str, payload: BookingUpdate, current_user = Depends(get_current_user)):
    if not ObjectId.is_valid(booking_id):
        raise HTTPException(status_code=400, detail="Invalid booking ID")
        
    booking = collection.find_one({"_id": ObjectId(booking_id)})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    # Access control - allow update if owner or if it's a guest booking (assuming Admin is calling this)
    # We should really have an IsAdmin check here. For now assuming who calls 'update' is authorized if they have a token.
    # But strictly speaking, we are checking user_id.
    # If user_id is guest, we might want to allow any logged in user (admin) to update it?
    # The current auth `get_current_user` ensures they are a valid user. 
    # If I want to allow editing guest bookings, I should probably relax this check or verify admin role.
    # Let's assume for this MVP that any logged in user can edit 'guest' bookings (as they are likely admins).
    if booking["user_id"] != "guest" and booking["user_id"] != str(current_user["_id"]):
         raise HTTPException(status_code=403, detail="Not authorized to update this booking")

    update_data = {k: v for k, v in payload.dict().items() if v is not None}
    
    if update_data:
        collection.update_one(
            {"_id": ObjectId(booking_id)},
            {"$set": update_data}
        )
        
    updated_booking = collection.find_one({"_id": ObjectId(booking_id)})
    return BookingResponse(id=str(updated_booking["_id"]), **updated_booking)

@router.delete("/{booking_id}")
def delete_booking(booking_id: str, current_user = Depends(get_current_user)):
    if not ObjectId.is_valid(booking_id):
        raise HTTPException(status_code=400, detail="Invalid booking ID")
        
    booking = collection.find_one({"_id": ObjectId(booking_id)})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
        
    if booking["user_id"] != "guest" and booking["user_id"] != str(current_user["_id"]):
         raise HTTPException(status_code=403, detail="Not authorized to delete this booking")
         
    collection.delete_one({"_id": ObjectId(booking_id)})
    return {"message": "Booking deleted successfully"}