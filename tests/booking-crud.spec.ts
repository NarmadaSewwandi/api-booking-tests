import { test, expect } from '@playwright/test';
import { newBooking } from '../helpers/bookingData';
import { authHeader, createBooking, getToken } from '../helpers/api';

test.describe('Booking lifecycle (CRUD)', () => {
  test('create a booking and read it back @smoke', async ({ request }) => {
    const booking = newBooking();

    const res = await request.post('/booking', { data: booking });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.bookingid).toEqual(expect.any(Number));
    expect(body.booking).toEqual(booking);

    const get = await request.get(`/booking/${body.bookingid}`);
    expect(get.status()).toBe(200);
    expect(await get.json()).toEqual(booking);
  });

  test('full update (PUT) replaces the booking', async ({ request }) => {
    const id = await createBooking(request, newBooking());
    const token = await getToken(request);
    const updated = newBooking({ lastname: 'Updated', totalprice: 999, depositpaid: false });

    const res = await request.put(`/booking/${id}`, { data: updated, headers: authHeader(token) });
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual(updated);
  });

  test('partial update (PATCH) changes only the given fields', async ({ request }) => {
    const original = newBooking();
    const id = await createBooking(request, original);
    const token = await getToken(request);

    const res = await request.patch(`/booking/${id}`, {
      data: { additionalneeds: 'Late checkout' },
      headers: authHeader(token),
    });
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual({ ...original, additionalneeds: 'Late checkout' });
  });

  test('deleted booking can no longer be fetched', async ({ request }) => {
    const id = await createBooking(request, newBooking());
    const token = await getToken(request);

    const del = await request.delete(`/booking/${id}`, { headers: authHeader(token) });
    expect(del.status()).toBe(201); // documented quirk: delete returns 201 Created

    const get = await request.get(`/booking/${id}`);
    expect(get.status()).toBe(404);
  });

  test('booking can be found by guest name', async ({ request }) => {
    const booking = newBooking();
    const id = await createBooking(request, booking);

    const res = await request.get('/booking', {
      params: { firstname: booking.firstname, lastname: booking.lastname },
    });
    expect(res.status()).toBe(200);
    const ids = (await res.json()).map((b: { bookingid: number }) => b.bookingid);
    expect(ids).toContain(id);
  });
});
