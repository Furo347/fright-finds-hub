import "dotenv/config";
import express from "express";
import cors from "cors";
import movieRoutes from "./routes/movieRoutes";
import adminRoutes from "./routes/adminRoutes";
import { login } from "./controller/adminController";

const app = express();
const rawOrigins = process.env.FRONTEND_ORIGIN || "http://localhost:8080";
const allowAll = rawOrigins.split(",").some((origin) => origin.trim() === "*");
const allowedOrigins = rawOrigins
  .split(",")
  .map((origin) => origin.trim())
  .filter((origin) => origin.length > 0 && origin !== "*");

const corsMiddleware = cors({
  credentials: true,
  origin(origin, callback) {
    if (allowAll || !origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`Blocked by CORS: ${origin}`));
  },
});

app.use(corsMiddleware);
app.options("/api/*", corsMiddleware);
app.options("/api", corsMiddleware);
app.use(express.json());

app.use("/api/movies", movieRoutes);
app.use("/api/admin", adminRoutes);

app.post("/api/login", login);

app.get("/", (req, res) => res.json({ message: "Backend ready!" }));
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

export default app;
