export interface Booking {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: { checkin: string; checkout: string };
  additionalneeds?: string;
}

/** Builds a valid booking with unique names, so parallel tests never clash. */
export function newBooking(overrides: Partial<Booking> = {}): Booking {
  const id = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  return {
    firstname: `Test${id}`,
    lastname: 'Traveller',
    totalprice: 450,
    depositpaid: true,
    bookingdates: { checkin: '2026-12-01', checkout: '2026-12-05' },
    additionalneeds: 'Breakfast',
    ...overrides,
  };
}
