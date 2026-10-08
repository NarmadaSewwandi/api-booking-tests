# Hotel Booking API Tests

![API Tests](https://github.com/NarmadaSewwandi/api-booking-tests/actions/workflows/api-tests.yml/badge.svg)

Automated REST API tests for a hotel booking service ([Restful-Booker](https://restful-booker.herokuapp.com/apidoc/index.html)), written with **Playwright's API testing** in **TypeScript** and run in **GitHub Actions**. No browser is needed, so the whole suite runs in seconds.

## What is tested

| Area | Scenarios |
|---|---|
| Health & auth | Ping, token for valid credentials, rejection of bad credentials |
| Booking lifecycle | Create → read, full update (PUT), partial update (PATCH), delete → 404, search by guest name |
| Security & negative | Update without token (403), delete with invalid token (403, booking still exists), unknown id (404), missing required fields |

12 tests in total.

## Approach

- **Each test creates its own data** with unique guest names, so tests run in parallel and never depend on each other or on existing records.
- **Full response checks:** the created and updated bookings are compared field by field against what was sent, not just checked for a 200 status.
- **Verify side effects:** after a delete, the test confirms the booking is gone; after a rejected delete, it confirms the booking still exists.
- **Reusable helpers** for auth and booking creation keep each test short and readable.

## API behaviour worth noting

Restful-Booker is a practice API with deliberate quirks. These tests document them rather than hide them:

- `GET /ping` returns **201** instead of 200.
- `DELETE /booking/{id}` returns **201 Created** instead of 200/204.
- A booking with missing required fields returns **500** instead of a 400 validation error.

In a real project I would raise these as defects, since clients rely on correct status codes.

## How to run

```bash
npm ci
npm test
npm run report
```

Run against another environment:

```bash
BASE_URL=https://my-test-env.example.com npm test
```

## Tech stack

Playwright Test (APIRequestContext) · TypeScript · GitHub Actions
