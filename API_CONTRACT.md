# Campus Equipment Booking API Contract

## Base URL

```text
http://127.0.0.1:8787/api
```

## Equipment

### GET /equipment

Returns all available equipment.

**Success: 200 OK**

Example response:

```json
[
  {
    "id": "eq-1",
    "name": "Projector A",
    "location": "Building 1"
  },
  {
    "id": "eq-2",
    "name": "Camera A",
    "location": "Building 2"
  }
]
```

---

# Bookings

## GET /bookings

Returns all bookings.

**Success: 200 OK**

Example:

```json
[
  {
    "id": 1,
    "equipmentId": "eq-1",
    "borrowerName": "Somchai Jaidee",
    "startAt": "2026-10-20T09:00:00.000Z",
    "endAt": "2026-10-20T11:00:00.000Z",
    "purpose": "Class presentation"
  }
]
```

## GET /bookings/:id

Returns one booking.

**Success: 200 OK**

Example:

```json
{
  "id": 1,
  "equipmentId": "eq-1",
  "borrowerName": "Somchai Jaidee",
  "startAt": "2026-10-20T09:00:00.000Z",
  "endAt": "2026-10-20T11:00:00.000Z",
  "purpose": "Class presentation"
}
```

**Not found: 404**

```json
{
  "error": "Booking not found"
}
```

---

## POST /bookings

Creates a new booking.

### Request body

```json
{
  "equipmentId": "eq-1",
  "borrowerName": "Somchai Jaidee",
  "startAt": "2026-10-20T09:00:00.000Z",
  "endAt": "2026-10-20T11:00:00.000Z",
  "purpose": "Class presentation"
}
```

**Success: 201 Created**

Returns the created booking.

### Validation

* `equipmentId` must exist.
* All required fields must be provided.
* `startAt` and `endAt` must be valid date/time values.
* `startAt` must be before `endAt`.
* The same equipment cannot have overlapping bookings.

**400 Bad Request**

```json
{
  "error": "startAt must be before endAt"
}
```

**404 Not Found**

```json
{
  "error": "Equipment not found"
}
```

**409 Conflict**

```json
{
  "error": "Booking time conflicts with an existing booking"
}
```

---

## PATCH /bookings/:id

Updates an existing booking.

### Request body

```json
{
  "equipmentId": "eq-1",
  "borrowerName": "James Chao",
  "startAt": "2026-10-20T09:00:00.000Z",
  "endAt": "2026-10-20T11:00:00.000Z",
  "purpose": "Meeting"
}
```

**Success: 200 OK**

Returns the updated booking.

The same validation rules as `POST /bookings` are applied.

**404 Not Found**

```json
{
  "error": "Booking not found"
}
```

**409 Conflict**

```json
{
  "error": "Booking time conflicts with an existing booking"
}
```

---

## DELETE /bookings/:id

Deletes a booking.

**Success: 204 No Content**

**404 Not Found**

```json
{
  "error": "Booking not found"
}
```

---

# Error Response Format

All API errors use the following JSON format:

```json
{
  "error": "A message understandable to a user or developer"
}
```

## Status Codes

| Status Code | Meaning                               |
| ----------- | ------------------------------------- |
| 200         | Request successful                    |
| 201         | Booking created successfully          |
| 204         | Booking deleted successfully          |
| 400         | Invalid request or invalid time range |
| 404         | Equipment or booking not found        |
| 409         | Booking time conflict                 |
