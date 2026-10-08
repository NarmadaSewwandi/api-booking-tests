import { test, expect } from '@playwright/test';
import { newBooking } from '../helpers/bookingData';
import { authHeader, createBooking } from '../helpers/api';

test.describe('Authorisation and negative cases', () => {
  test('update without a token is forbidden', async ({ request }) => {
    const id = await createBooking(request, newBooking());
    const res = await request.put(`/booking/${id}`, { data: newBooking() });
    expect(res.status()).toBe(403);
  });

  test('delete with an invalid token is forbidden', async ({ request }) => {
    const id = await createBooking(request, newBooking());
    const res = await request.delete(`/booking/${id}`, { headers: authHeader('not-a-real-token') });
    expect(res.status()).toBe(403);

    // and the booking still exists
    expect((await request.get(`/booking/${id}`)).status()).toBe(200);
  });

  test('unknown booking id returns 404', async ({ request }) => {
    const res = await request.get('/booking/999999999');
    expect(res.status()).toBe(404);
  });

  test('booking without required fields is rejected', async ({ request }) => {
    const res = await request.post('/booking', { data: { firstname: 'OnlyFirstName' } });
    expect(res.ok()).toBeFalsy(); // API answers 500; a stricter API would use 400
  });
});
