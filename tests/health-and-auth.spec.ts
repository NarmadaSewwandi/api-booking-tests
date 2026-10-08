import { test, expect } from '@playwright/test';

test.describe('Health check and authentication', () => {
  test('service is up @smoke', async ({ request }) => {
    const res = await request.get('/ping');
    expect(res.status()).toBe(201); // this API returns 201 for a healthy ping
  });

  test('valid credentials return a token @smoke', async ({ request }) => {
    const res = await request.post('/auth', { data: { username: 'admin', password: 'password123' } });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(typeof body.token).toBe('string');
    expect(body.token.length).toBeGreaterThan(0);
  });

  test('invalid credentials do not return a token', async ({ request }) => {
    const res = await request.post('/auth', { data: { username: 'admin', password: 'wrong' } });
    const body = await res.json();
    expect(body.token).toBeUndefined();
    expect(body.reason).toBe('Bad credentials');
  });
});
