from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError, ExpiredSignatureError
from decouple import config
from uuid import UUID


SUPABASE_JWT_SECRET = config('SUPABASE_JWT_SECRET')
JWT_ALGORITHM = config('JWT_ALGORITHM')

auth_scheme = HTTPBearer()


def verify_token(credentials: HTTPAuthorizationCredentials = Security(auth_scheme)):
    token = credentials.credentials
    print(f"Verifying token: {token}")
    try:
        payload = jwt.decode(token, SUPABASE_JWT_SECRET,
                             algorithms=[JWT_ALGORITHM], audience='authenticated')
        return payload
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except JWTError:
        raise HTTPException(status_code=403, detail="Invalid token")


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(auth_scheme)) -> UUID:

    token = credentials.credentials
    print(f"Verifying token: {token}")
    try:
        payload = jwt.decode(token, SUPABASE_JWT_SECRET,
                             algorithms=[JWT_ALGORITHM], audience='authenticated')
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=403, detail="Invalid token")
        return UUID(user_id)
    except JWTError:
        raise HTTPException(status_code=403, detail="Invalid token")
