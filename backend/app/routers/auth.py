from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import models, schemas, auth, database

router = APIRouter(prefix="/auth", tags=["Authentication"])

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# We export get_current_user from auth.py so other routers can use it easily
get_current_user = auth.get_current_user

@router.post("/sync-user", response_model=schemas.User)
def sync_user(
    user_info: schemas.UserCreate, 
    decoded_token: dict = Depends(auth.verify_firebase_token),
    db: Session = Depends(get_db)
):
    """
    Syncs the Firebase user with the local database.
    Called from the frontend after successful Firebase signup/login.
    """
    email = decoded_token.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Token does not contain email")
    
    db_user = db.query(models.User).filter(models.User.email == email).first()
    if db_user:
        # Update name if changed
        if user_info.full_name and db_user.full_name != user_info.full_name:
            db_user.full_name = user_info.full_name
            db.commit()
            db.refresh(db_user)
        return db_user
    
    # Create new user in local DB
    db_user = models.User(
        email=email, 
        full_name=user_info.full_name, 
        role=user_info.role,
        hashed_password="FIREBASE_MANAGED" # We don't store passwords anymore
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

