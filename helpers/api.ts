import { APIRequestContext, expect } from '@playwright/test';
import { Booking } from './bookingData';

// Public demo credentials documented by restful-booker.
const ADMIN = { username: 'admin', password: 'password123' };

export async function getToken(request: APIRequestContext): Promise<string> {
  const res = await request.post('/auth', { data: ADMIN });
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(body.token, 'auth should return a token').toBeTruthy();
  return body.token;
}

export async function createBooking(request: APIRequestContext, booking: Booking) {
  const res = await request.post('/booking', { data: booking });
  expect(res.status()).toBe(200);
  const body = await res.json();
  return body.bookingid as number;
}

export const authHeader = (token: string) => ({ Cookie: `token=${token}` });
