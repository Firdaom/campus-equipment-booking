import { Hono } from "hono";

type Bindings = {
    exam_db: D1Database;
};

const equipment = new Hono<{ Bindings: Bindings }>();

// GET /api/equipment
equipment.get("/", async (c) => {
    try {
        const result = await c.env.exam_db
            .prepare("SELECT * FROM equipment ORDER BY id")
            .all();

        return c.json(result.results, 200);

    } catch (error) {
        console.error(error);

        return c.json({
            error: "Internal server error"
        }, 500);
    }
});

// GET /api/equipment/:id
equipment.get("/:id", async (c) => {
    try {
        const id = c.req.param("id");

        const item = await c.env.exam_db
            .prepare("SELECT * FROM equipment WHERE id = ?")
            .bind(id)
            .first();

        if (!item) {
            return c.json({
                error: "Equipment not found"
            }, 404);
        }

        return c.json(item, 200);

    } catch (error) {
        console.error(error);

        return c.json({
            error: "Internal server error"
        }, 500);
    }
});

export default equipment;