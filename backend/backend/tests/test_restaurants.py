import pytest


RESTAURANT_PAYLOAD = {
    "name": "Test Diner",
    "cuisine_type": "indian",
    "address": "1 Test Street",
    "city": "TestCity",
    "min_order": 100.0,
    "delivery_fee": 20.0,
    "delivery_time_min": 30,
}


def test_create_restaurant(client, auth_headers):
    resp = client.post("/api/v1/restaurants/", json=RESTAURANT_PAYLOAD, headers=auth_headers)
    assert resp.status_code == 201
    data = resp.json()
    assert data["name"] == "Test Diner"
    assert data["city"] == "TestCity"
    return data["id"]


def test_list_restaurants(client):
    resp = client.get("/api/v1/restaurants/")
    assert resp.status_code == 200
    body = resp.json()
    assert "items" in body
    assert "total" in body


def test_get_restaurant(client, auth_headers):
    create = client.post(
        "/api/v1/restaurants/", json=RESTAURANT_PAYLOAD, headers=auth_headers
    ).json()
    resp = client.get(f"/api/v1/restaurants/{create['id']}")
    assert resp.status_code == 200
    assert resp.json()["id"] == create["id"]


def test_update_restaurant(client, auth_headers):
    create = client.post(
        "/api/v1/restaurants/", json=RESTAURANT_PAYLOAD, headers=auth_headers
    ).json()
    resp = client.put(
        f"/api/v1/restaurants/{create['id']}",
        json={"name": "Updated Diner"},
        headers=auth_headers,
    )
    assert resp.status_code == 200
    assert resp.json()["name"] == "Updated Diner"


def test_filter_by_city(client, auth_headers):
    client.post("/api/v1/restaurants/", json=RESTAURANT_PAYLOAD, headers=auth_headers)
    resp = client.get("/api/v1/restaurants/?city=TestCity")
    assert resp.status_code == 200
    for item in resp.json()["items"]:
        assert "TestCity" in item["city"]
