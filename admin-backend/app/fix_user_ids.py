#!/usr/bin/env python3
"""
Script to fix inconsistent user_ids in PDF documents
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db import db
from bson import ObjectId

def fix_pdf_user_ids():
    """Fix user_id inconsistencies in PDF documents"""
    
    pdfs_collection = db["drive_pdfs"]
    users_collection = db["users"]
    links_collection = db["drive_links"]
    
    print("🔧 Starting PDF user_id fix...")
    
    # Get all PDFs
    all_pdfs = list(pdfs_collection.find())
    print(f"📊 Total PDFs: {len(all_pdfs)}")
    
    fixed_count = 0
    for pdf in all_pdfs:
        pdf_id = pdf["_id"]
        current_user_id = pdf.get("user_id", "")
        user_email = pdf.get("user_email", "")
        
        print(f"\n📄 Processing PDF: {pdf.get('filename', 'Unknown')}")
        print(f"   Current user_id: {current_user_id}")
        print(f"   User email: {user_email}")
        
        # Try to find the correct user
        correct_user = None
        
        # Method 1: Find user by email
        if user_email:
            correct_user = users_collection.find_one({"email": user_email})
        
        # Method 2: Find user by partial ID match
        if not correct_user and current_user_id and len(current_user_id) >= 20:
            # Look for users with similar ID
            partial_id = current_user_id[:20]
            similar_users = list(users_collection.find({
                "_id": {"$regex": f"^{partial_id}"}
            }))
            if similar_users:
                correct_user = similar_users[0]
        
        # Method 3: Find user from associated link
        if not correct_user:
            link_id = pdf.get("link_id")
            if link_id:
                try:
                    link = links_collection.find_one({"_id": ObjectId(link_id)})
                    if link:
                        link_user_email = link.get("user_email")
                        if link_user_email:
                            correct_user = users_collection.find_one({"email": link_user_email})
                except:
                    pass
        
        if correct_user:
            correct_user_id = str(correct_user["_id"])
            correct_user_email = correct_user.get("email", "")
            
            if correct_user_id != current_user_id:
                # Update the PDF with correct user_id
                pdfs_collection.update_one(
                    {"_id": pdf_id},
                    {"$set": {
                        "user_id": correct_user_id,
                        "user_email": correct_user_email,
                        "user_name": f"{correct_user.get('first_name', '')} {correct_user.get('last_name', '')}".strip()
                    }}
                )
                print(f"   ✅ Fixed: {current_user_id} -> {correct_user_id}")
                fixed_count += 1
            else:
                print(f"   ✓ Already correct")
        else:
            print(f"   ⚠️ Could not find matching user")
    
    print(f"\n🎉 Fix completed. Fixed {fixed_count} PDF documents.")
    return fixed_count

if __name__ == "__main__":
    fix_pdf_user_ids()