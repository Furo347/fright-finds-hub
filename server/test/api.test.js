import request from "supertest";
import app from "../index.js"; // ou ton instance express

describe("API Routes", () => {
    it("GET /api/health should return 200", async () => {
        const res = await request(app).get("/api/health");
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe("ok");
    });
});
