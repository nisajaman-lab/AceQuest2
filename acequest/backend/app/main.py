import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.db import engine, Base, SessionLocal
from app.routers import auth, player, game, admin
from app.seed import seed_db

# Load environment variables
load_dotenv()

# Create tables
Base.metadata.create_all(bind=engine)

# Seed database with initial data
db = SessionLocal()
try:
    seed_db(db)
finally:
    db.close()

# Initialize FastAPI App
app = FastAPI(
    title="AceQuest API",
    description="Educational RPG Spy Game Backend for Agent Ragam",
    version="1.0.0",
)

# Configure CORS
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    # Allow all in development (configurable later)
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(auth.router)
app.include_router(player.router)
app.include_router(game.router)
app.include_router(admin.router)


@app.get("/")
def read_root():
    return {
        "message": "Welcome to AceQuest API!",
        "status": "online",
        "documentation": "/docs",
    }


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", "8000"))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run("app.main:app", host=host, port=port, reload=True)
