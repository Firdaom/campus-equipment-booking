# AI Log

## Purpose

AI was used as an assistant during development of the Campus Equipment Booking API.

## Important AI Assistance

### 1. API and database design

* Used the exam API contract to check the required fields and endpoints.
* Verified that the final schema matched the task requirements.

### 2. Booking validation

* Asked AI to help implement validation for:

  * Missing or invalid booking data
  * `equipmentId` that does not exist
  * `startAt` and `endAt`
  * Overlapping bookings
* Tested the implementation manually using HTTP requests.

### 3. CRUD implementation

* Checked the returned status codes and JSON responses against the API contract.

### 4. Testing and debugging

* Used AI to suggest test cases for successful requests and error cases.
* Ran the commands myself and checked the actual API responses.
* Verified `400`, `404`, `409`, `200`, `201`, and `204` responses.


