from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.drive_links import router as drive_links_router

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(drive_links_router)

@app.get("/")
def root():
    return {"message": "FastAPI + MongoDB backend is running"}
