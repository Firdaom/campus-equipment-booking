import { Hono } from "hono";

type Bindings = {
    exam_db: D1Database;
};

const bookings = new Hono<{ Bindings: Bindings }>();

// GET /api/bookings
bookings.get("/", async (c) => {
    try {
        const result = await c.env.exam_db
            .prepare("SELECT * FROM bookings ORDER BY id")
            .all();

        return c.json(result.results, 200);

    } catch (error) {
        console.error(error);

        return c.json({
            error: "Internal server error"
        }, 500);
    }
});


// GET /api/bookings/:id
bookings.get("/:id", async (c) => {
    try {
        const id = c.req.param("id");

        const booking = await c.env.exam_db
            .prepare("SELECT * FROM bookings WHERE id = ?")
            .bind(id)
            .first();

        if (!booking) {
            return c.json({
                error: "Booking not found"
            }, 404);
        }

        return c.json(booking, 200);

    } catch (error) {
        console.error(error);

        return c.json({
            error: "Internal server error"
        }, 500);
    }
});


// POST /api/bookings
bookings.post("/", async (c) => {
    try {
        const body = await c.req.json();

        const {
            equipmentId,
            borrowerName,
            startAt,
            endAt,
            purpose
        } = body;

        // Validate required fields
        if (
            typeof equipmentId !== "string" ||
            typeof borrowerName !== "string" ||
            typeof startAt !== "string" ||
            typeof endAt !== "string" ||
            typeof purpose !== "string" ||
            !equipmentId ||
            !borrowerName ||
            !startAt ||
            !endAt ||
            !purpose
        ) {
            return c.json({
                error: "All fields are required"
            }, 400);
        }

        // Validate date/time
        const start = new Date(startAt);
        const end = new Date(endAt);

        if (
            Number.isNaN(start.getTime()) ||
            Number.isNaN(end.getTime())
        ) {
            return c.json({
                error: "Invalid date/time"
            }, 400);
        }

        if (start >= end) {
            return c.json({
                error: "startAt must be before endAt"
            }, 400);
        }

        const normalizedStartAt = start.toISOString();
        const normalizedEndAt = end.toISOString();

        // Check equipment exists
        const equipment = await c.env.exam_db
            .prepare("SELECT id FROM equipment WHERE id = ?")
            .bind(equipmentId)
            .first();

        if (!equipment) {
            return c.json({
                error: "Equipment not found"
            }, 404);
        }

        // Check overlapping booking
        const conflict = await c.env.exam_db
            .prepare(`
                SELECT id
                FROM bookings
                WHERE equipmentId = ?
                AND startAt < ?
                AND endAt > ?
            `)
            .bind(
                equipmentId,
                normalizedEndAt,
                normalizedStartAt
            )
            .first();

        if (conflict) {
            return c.json({
                error: "Booking time conflicts with an existing booking"
            }, 409);
        }

        // Create booking
        const result = await c.env.exam_db
            .prepare(`
                INSERT INTO bookings
                (equipmentId, borrowerName, startAt, endAt, purpose)
                VALUES (?, ?, ?, ?, ?)
            `)
            .bind(
                equipmentId,
                borrowerName,
                normalizedStartAt,
                normalizedEndAt,
                purpose
            )
            .run();

        const booking = await c.env.exam_db
            .prepare("SELECT * FROM bookings WHERE id = ?")
            .bind(result.meta.last_row_id)
            .first();

        return c.json(booking, 201);

    } catch (error) {
        console.error(error);

        return c.json({
            error: "Invalid request body"
        }, 400);
    }
});

// PATCH /api/bookings/:id
bookings.patch("/:id", async (c) => {
    try {
        const id = c.req.param("id");
        const body = await c.req.json();

        const {
            equipmentId,
            borrowerName,
            startAt,
            endAt,
            purpose
        } = body;

        // Validate required fields
        if (
            typeof equipmentId !== "string" ||
            typeof borrowerName !== "string" ||
            typeof startAt !== "string" ||
            typeof endAt !== "string" ||
            typeof purpose !== "string" ||
            !equipmentId ||
            !borrowerName ||
            !startAt ||
            !endAt ||
            !purpose
        ) {
            return c.json({
                error: "All fields are required"
            }, 400);
        }

        // Check booking exists
        const existingBooking = await c.env.exam_db
            .prepare("SELECT id FROM bookings WHERE id = ?")
            .bind(id)
            .first();

        if (!existingBooking) {
            return c.json({
                error: "Booking not found"
            }, 404);
        }

        // Validate date/time
        const start = new Date(startAt);
        const end = new Date(endAt);

        if (
            Number.isNaN(start.getTime()) ||
            Number.isNaN(end.getTime())
        ) {
            return c.json({
                error: "Invalid date/time"
            }, 400);
        }

        if (start >= end) {
            return c.json({
                error: "startAt must be before endAt"
            }, 400);
        }

        const normalizedStartAt = start.toISOString();
        const normalizedEndAt = end.toISOString();

        // Check equipment exists
        const equipment = await c.env.exam_db
            .prepare("SELECT id FROM equipment WHERE id = ?")
            .bind(equipmentId)
            .first();

        if (!equipment) {
            return c.json({
                error: "Equipment not found"
            }, 404);
        }

        // Check overlapping booking except itself
        const conflict = await c.env.exam_db
            .prepare(`
                SELECT id
                FROM bookings
                WHERE equipmentId = ?
                AND startAt < ?
                AND endAt > ?
                AND id != ?
            `)
            .bind(
                equipmentId,
                normalizedEndAt,
                normalizedStartAt,
                id
            )
            .first();

        if (conflict) {
            return c.json({
                error: "Booking time conflicts with an existing booking"
            }, 409);
        }

        // Update booking
        await c.env.exam_db
            .prepare(`
                UPDATE bookings
                SET equipmentId = ?,
                    borrowerName = ?,
                    startAt = ?,
                    endAt = ?,
                    purpose = ?
                WHERE id = ?
            `)
            .bind(
                equipmentId,
                borrowerName,
                normalizedStartAt,
                normalizedEndAt,
                purpose,
                id
            )
            .run();

        const updatedBooking = await c.env.exam_db
            .prepare("SELECT * FROM bookings WHERE id = ?")
            .bind(id)
            .first();

        return c.json(updatedBooking, 200);

    } catch (error) {
        console.error(error);

        return c.json({
            error: "Invalid request body"
        }, 400);
    }
});


// DELETE /api/bookings/:id
bookings.delete("/:id", async (c) => {
    try {
        const id = c.req.param("id");

        const existingBooking = await c.env.exam_db
            .prepare("SELECT id FROM bookings WHERE id = ?")
            .bind(id)
            .first();

        if (!existingBooking) {
            return c.json({
                error: "Booking not found"
            }, 404);
        }

        await c.env.exam_db
            .prepare("DELETE FROM bookings WHERE id = ?")
            .bind(id)
            .run();

        return c.body(null, 204);

    } catch (error) {
        console.error(error);

        return c.json({
            error: "Internal server error"
        }, 500);
    }
});

export default bookings;