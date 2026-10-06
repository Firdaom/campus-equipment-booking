# Quality Gate Review

| Quality Gate area      | Finding                                                                                      | Action taken                                                                  | Evidence                                                        |
| ---------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Reliability            | The API needed to prevent two bookings for the same equipment from having overlapping times. | Added an overlap check before creating or updating a booking.                 | Tested an overlapping booking and received `409 Conflict`.      |
| Accuracy               | A booking should not be created when `startAt` is after or equal to `endAt`.                 | Added date validation and return `400 Bad Request` for an invalid time range. | Tested an invalid time range and received `400`.                |
| Reasoning / You Own It | An update should not detect the booking itself as an overlapping booking.                    | Excluded the current booking from the overlap query using `id != ?`.          | Updated an existing booking successfully and received `200 OK`. |

## Additional Checks

* Verified that `equipmentId` must exist before creating or updating a booking.
* Verified that SQL queries use parameter binding.
* Verified that error responses use the required JSON format.
* Tested the required CRUD operations and error cases.

## Submission Decision

**READY**

The required API endpoints, validation, error handling, database operations, testing, and documentation have been implemented and checked.
