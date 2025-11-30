export async function login(username, password) {
  const res = await fetch('http://localhost:5052/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: username, password }),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = data && data.error ? data.error : `HTTP ${res.status}`;
    throw new Error(`Login failed: ${msg}`);
  }
  return data;
}


export async function fetchMenuItems(){
    const res = await fetch('http://localhost:5052/menu-items', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
        const msg = data && data.error ? data.error : `HTTP ${res.status}`;
        throw new Error(`Failed to fetch menu items: ${msg}`);
    }
    return data;
}


export async function checkoutOrder(order) {
  const res = await fetch('http://localhost:5052/checkout-cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = data && data.error ? data.error : `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export async function fetchOrders(userId) {
    const res = await fetch(`http://localhost:5052/orders?userId=${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
        const msg = data && data.error ? data.error : `HTTP ${res.status}`;
        throw new Error(`Failed to fetch orders: ${msg}`);
    }
    return data;
}

export async function fetchAllOrders() {
    const res = await fetch(`http://localhost:5052/all-orders`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
        const msg = data && data.error ? data.error : `HTTP ${res.status}`;
        throw new Error(`Failed to fetch orders: ${msg}`);
    }
    return data;
}

export async function updateOrderStatus(orderId) {
    const res = await fetch(`http://localhost:5052/update-order-status?orderid=${orderId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderid: orderId }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
        const msg = data && data.error ? data.error : `HTTP ${res.status}`;
        throw new Error(`Failed to update order status: ${msg}`);
    }
    return data;
}
export async function deleteOrder(orderId) {
    const res = await fetch(`http://localhost:5052/delete-order?orderid=${orderId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderid: orderId }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
        const msg = data && data.error ? data.error : `HTTP ${res.status}`;
        throw new Error(`Failed to delete order: ${msg}`);
    }
    return data;
}

