# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware

# app = FastAPI()

# origins = [
#     "http://localhost:3000",
#     "http://localhost:3001",
# ]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# try:
#     from app.routes.auth import router as auth_router
#     app.include_router(auth_router)
#     print("✅ Auth router loaded successfully")
# except ImportError as e:
#     print(f"⚠️  Auth router not loaded: {e}")

# try:
#     from app.routes.drive_links import router as drive_links_router
#     app.include_router(drive_links_router)
#     print("✅ Drive links router loaded successfully")
# except ImportError as e:
#     print(f"⚠️  Drive links router not loaded: {e}")

# @app.get("/")
# def root():
#     return {"message": "FastAPI + MongoDB backend is running"}

# @app.get("/health")
# def health_check():
#     return {"status": "healthy", "service": "solar-panel-api"}

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


try:
    from app.routes.auth import router as auth_router
    app.include_router(auth_router)
    print("✅ Auth router loaded successfully")
except ImportError as e:
    print(f"⚠️  Auth router not loaded: {e}")

try:
    from app.routes.drive_links import router as drive_links_router
    app.include_router(drive_links_router)
    print("✅ Drive links router loaded successfully")
except ImportError as e:
    print(f"⚠️  Drive links router not loaded: {e}")

try:
    from app.routes.bookings import router as bookings_router
    app.include_router(bookings_router)
    print("✅ Bookings router loaded successfully")
except ImportError as e:
    print(f"⚠️  Bookings router not loaded: {e}")

try:
    from app.routes.contacts import router as contacts_router
    app.include_router(contacts_router)
    print("✅ Contacts router loaded successfully")
except ImportError as e:
    print(f"⚠️  Contacts router not loaded: {e}")

@app.get("/")
def root():
    return {"message": "FastAPI + MongoDB backend is running (Contacts enabled)"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "solar-panel-api"}