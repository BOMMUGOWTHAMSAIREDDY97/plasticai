from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
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
    user_info: schemas.UserBase, 
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

@router.get("/users", response_model=List[schemas.User])
def get_all_users(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return db.query(models.User).all()

@router.put("/users/{user_id}/role", response_model=schemas.User)
def update_user_role(
    user_id: int,
    role_update: schemas.RoleUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    if role_update.role not in ["admin", "operator", "government"]:
        raise HTTPException(status_code=400, detail="Invalid role")
        
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    user.role = role_update.role
    db.commit()
    db.refresh(user)
    return user
