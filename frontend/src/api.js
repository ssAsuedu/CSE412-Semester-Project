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