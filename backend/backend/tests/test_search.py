def test_search_dishes(client, auth_headers):
    # Create a restaurant + menu item to search for
    r = client.post("/api/v1/restaurants/", json={
        "name": "Search Test Kitchen",
        "cuisine_type": "indian",
        "address": "5 Search Blvd",
        "city": "Delhi",
        "min_order": 0.0,
        "delivery_fee": 0.0,
        "delivery_time_min": 20,
    }, headers=auth_headers).json()

    client.post(f"/api/v1/menu/{r['id']}/items", json={
        "name": "Paneer Tikka",
        "category": "starter",
        "price": 199.0,
        "is_veg": True,
    }, headers=auth_headers)

    resp = client.get("/api/v1/search/?q=Paneer")
    assert resp.status_code == 200
    data = resp.json()
    assert "dishes" in data
    assert "restaurants" in data
    assert data["total_dishes"] >= 1
    assert any("Paneer" in d["name"] for d in data["dishes"])


def test_search_restaurant_by_name(client, auth_headers):
    client.post("/api/v1/restaurants/", json={
        "name": "Unique Spice Garden",
        "cuisine_type": "indian",
        "address": "99 Spice Lane",
        "city": "Bangalore",
        "min_order": 0.0,
        "delivery_fee": 0.0,
        "delivery_time_min": 25,
    }, headers=auth_headers)

    resp = client.get("/api/v1/search/?q=Unique+Spice")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_restaurants"] >= 1


def test_search_with_veg_filter(client, auth_headers):
    resp = client.get("/api/v1/search/?q=Tikka&is_veg=true")
    assert resp.status_code == 200
    for dish in resp.json()["dishes"]:
        assert dish["is_veg"] is True


def test_search_with_price_filter(client, auth_headers):
    resp = client.get("/api/v1/search/?q=Tikka&min_price=100&max_price=300")
    assert resp.status_code == 200
    for dish in resp.json()["dishes"]:
        assert dish["price"] <= 300


def test_search_empty_query_rejected(client):
    resp = client.get("/api/v1/search/?q=")
    assert resp.status_code == 422
