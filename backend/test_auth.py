from fastapi.testclient import TestClient
from app.main import app
from app.core.database import SessionLocal, Base, engine
import sys

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"
    print("Root endpoint test passed.")

def test_auth_workflow():
    # Clean up DB if user already exists
    db = SessionLocal()
    from app.models.models import User
    existing = db.query(User).filter(User.email == "test@example.com").first()
    if existing:
        db.delete(existing)
        db.commit()
    db.close()

    # 1. Register user with invalid password (fails Pydantic checks)
    bad_user = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "password",
        "confirm_password": "password"
    }
    resp = client.post("/api/v1/auth/register", json=bad_user)
    assert resp.status_code == 422
    print("Invalid password format validation test passed.")

    # 2. Register user with valid password
    good_user = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "Password123!",
        "confirm_password": "Password123!"
    }
    resp = client.post("/api/v1/auth/register", json=good_user)
    assert resp.status_code == 201
    assert resp.json()["email"] == "test@example.com"
    assert resp.json()["is_verified"] is False
    user_id = resp.json()["id"]
    print("User registration test passed.")

    # 3. Verify Email
    resp = client.post(f"/api/v1/auth/verify-email/{user_id}")
    assert resp.status_code == 200
    print("Email verification workflow test passed.")
    
    # 4. Login
    login_data = {
        "email": "test@example.com",
        "password": "Password123!"
    }
    resp = client.post("/api/v1/auth/login", json=login_data)
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert "refresh_token" in data
    access_token = data["access_token"]
    print("User login and token generation test passed.")

    # 5. Access protected /me route
    headers = {"Authorization": f"Bearer {access_token}"}
    resp = client.get("/api/v1/auth/me", headers=headers)
    assert resp.status_code == 200
    assert resp.json()["email"] == "test@example.com"
    assert resp.json()["is_verified"] is True
    print("Protected user details fetch test passed.")

if __name__ == "__main__":
    try:
        test_root()
        test_auth_workflow()
        print("\nSUCCESS: All Auth integration tests passed successfully!")
    except AssertionError as e:
        print(f"\nFAILURE: Assert failed! {e}")
        sys.exit(1)
    except Exception as e:
        print(f"\nERROR: Unexpected test error! {e}")
        sys.exit(1)
