import { Hono } from "hono";
import equipment from "./routes/equipment";
import bookings from "./routes/bookings";

type Bindings = {
    exam_db: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => {
    return c.json({
        message: "API is running"
    });
});

app.route("/api/equipment", equipment);
app.route("/api/bookings", bookings);

export default app;