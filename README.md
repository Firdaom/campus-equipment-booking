# Campus Equipment Booking API

A REST API for booking shared campus equipment. The API prevents overlapping bookings for the same equipment.

## Tech Stack

* TypeScript
* Hono
* Cloudflare Workers
* Cloudflare D1 / SQLite

## Requirements

* Node.js
* npm

## Installation

Clone or open the project folder, then install dependencies:

```bash
npm install
```

## Database Setup

The project uses a local D1 database.

Apply the database schema:

```bash
npx wrangler d1 execute exam-db --local --file=src/db/schema.sql
```

The schema creates:

* `equipment` table
* `bookings` table
* Two sample equipment records

## Run the API

Start the development server:

```bash
npm run dev
```

The API will be available at:

```text
http://127.0.0.1:8787
```

API Base URL:

```text
http://127.0.0.1:8787/api
```

## API Endpoints

### Equipment

```text
GET /api/equipment
```

### Bookings

```text
GET    /api/bookings
GET    /api/bookings/:id
POST   /api/bookings
PATCH  /api/bookings/:id
DELETE /api/bookings/:id
```

## Testing

The API can be tested using `curl`, PowerShell `Invoke-RestMethod`, or another HTTP client.

Example:

```bash
curl -i http://127.0.0.1:8787/api/equipment
```

The API validates:

* Required booking fields
* Valid start and end times
* `startAt` must be before `endAt`
* `equipmentId` must exist
* Overlapping bookings are rejected
* SQL queries use parameter binding

## Expected Status Codes

| Status | Meaning               |
| ------ | --------------------- |
| 200    | Successful request    |
| 201    | Booking created       |
| 204    | Booking deleted       |
| 400    | Invalid request       |
| 404    | Resource not found    |
| 409    | Booking time conflict |
