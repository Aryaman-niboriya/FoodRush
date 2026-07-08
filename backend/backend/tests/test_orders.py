RESTAURANT_PAYLOAD = {
    "name": "Order Test Diner",
    "cuisine_type": "indian",
    "address": "2 Order St",
    "city": "Mumbai",
    "min_order": 0.0,
    "delivery_fee": 20.0,
    "delivery_time_min": 30,
}

MENU_ITEM_PAYLOAD = {
    "name": "Butter Chicken",
    "category": "main_course",
    "price": 299.0,
    "is_veg": False,
}


def _setup(client, auth_headers):
    r = client.post("/api/v1/restaurants/", json=RESTAURANT_PAYLOAD, headers=auth_headers).json()
    item = client.post(
        f"/api/v1/menu/{r['id']}/items", json=MENU_ITEM_PAYLOAD, headers=auth_headers
    ).json()
    return r["id"], item["id"]


def test_place_order(client, auth_headers):
    restaurant_id, item_id = _setup(client, auth_headers)
    resp = client.post("/api/v1/orders/", json={
        "restaurant_id": restaurant_id,
        "items": [{"menu_item_id": item_id, "quantity": 2}],
        "delivery_address": "42 Test Lane, Mumbai",
        "payment_method": "upi",
    }, headers=auth_headers)
    assert resp.status_code == 201
    data = resp.json()
    assert data["status"] == "pending"
    assert data["total_amount"] > 0
    assert len(data["items"]) == 1
    return data["id"]


def test_order_history(client, auth_headers):
    resp = client.get("/api/v1/orders/history", headers=auth_headers)
    assert resp.status_code == 200
    assert "items" in resp.json()


def test_get_order(client, auth_headers):
    restaurant_id, item_id = _setup(client, auth_headers)
    order = client.post("/api/v1/orders/", json={
        "restaurant_id": restaurant_id,
        "items": [{"menu_item_id": item_id, "quantity": 1}],
        "delivery_address": "Test Address",
        "payment_method": "cash",
    }, headers=auth_headers).json()
    resp = client.get(f"/api/v1/orders/{order['id']}", headers=auth_headers)
    assert resp.status_code == 200


def test_cancel_order(client, auth_headers):
    restaurant_id, item_id = _setup(client, auth_headers)
    order = client.post("/api/v1/orders/", json={
        "restaurant_id": restaurant_id,
        "items": [{"menu_item_id": item_id, "quantity": 1}],
        "delivery_address": "Cancel Address",
        "payment_method": "cash",
    }, headers=auth_headers).json()
    resp = client.post(f"/api/v1/orders/{order['id']}/cancel", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["status"] == "cancelled"
