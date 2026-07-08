def test_register_success(client):
    resp = client.post("/api/v1/auth/register", json={
        "full_name": "Jane Doe",
        "email": "jane@example.com",
        "password": "Secure@999",
    })
    assert resp.status_code == 201
    data = resp.json()
    assert data["email"] == "jane@example.com"
    assert "hashed_password" not in data


def test_register_duplicate_email(client, registered_user):
    resp = client.post("/api/v1/auth/register", json={
        "full_name": "Duplicate",
        "email": "test@example.com",
        "password": "Test@1234",
    })
    assert resp.status_code == 409


def test_login_success(client, registered_user):
    resp = client.post("/api/v1/auth/login", json={
        "email": "test@example.com",
        "password": "Test@1234",
    })
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client, registered_user):
    resp = client.post("/api/v1/auth/login", json={
        "email": "test@example.com",
        "password": "WrongPass@1",
    })
    assert resp.status_code == 401


def test_get_me(client, auth_headers):
    resp = client.get("/api/v1/users/me", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["email"] == "test@example.com"


def test_refresh_token(client, registered_user):
    login = client.post("/api/v1/auth/login", json={
        "email": "test@example.com",
        "password": "Test@1234",
    }).json()
    resp = client.post("/api/v1/auth/refresh", json={
        "refresh_token": login["refresh_token"]
    })
    assert resp.status_code == 200
    assert "access_token" in resp.json()
