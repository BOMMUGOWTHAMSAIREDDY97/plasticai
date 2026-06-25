import os
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth
from typing import Optional
from sqlalchemy.orm import Session
from . import database, models

import json

# Initialize Firebase Admin
if not firebase_admin._apps:
    env_creds = os.getenv("FIREBASE_CREDENTIALS")
    if env_creds:
        # Load from environment variable (Best for Render/Vercel)
        cred_dict = json.loads(env_creds)
        cred = credentials.Certificate(cred_dict)
    else:
        # Load from local file
        cred_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "firebase-credentials.json")
        cred = credentials.Certificate(cred_path)
        
    firebase_admin.initialize_app(cred)

security = HTTPBearer()

def verify_firebase_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        decoded_token = firebase_auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_user(
    decoded_token: dict = Depends(verify_firebase_token),
    db: Session = Depends(database.get_db)
):
    email = decoded_token.get("email")
    if email is None:
        raise HTTPException(status_code=400, detail="Token does not contain email")
    
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found in local database")
    return user
