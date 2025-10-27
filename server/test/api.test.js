import request from "supertest";
import app from "../app.js";

describe("API Routes", () => {
    it("GET /api/health should return 200", async () => {
        const res = await request(app).get("/api/health");
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe("ok");
    });

    it("GET /api/movies should return an array of movies", async () => {
        const res = await request(app).get("/api/movies");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it("POST /api/movies should require authentication", async () => {
        const res = await request(app)
            .post("/api/movies")
            .send({
                title: "Test Movie",
                year: 2024,
                director: "Tester",
                rating: 7.5,
                genre: "Horror",
                synopsis: "Test synopsis",
                imageUrl: "https://example.com/image.jpg"
            });
        expect(res.statusCode).toBe(401);
    });

    it("POST /api/movies should create a new movie when authenticated", async () => {
        const login = await request(app)
            .post("/api/login")
            .send({ username: "admin", password: "password" });
        expect(login.statusCode).toBe(200);
        const token = login.body.token;

        const res = await request(app)
            .post("/api/movies")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Integration Test Movie",
                year: 2025,
                director: "ChatGPT",
                rating: 8.2,
                genre: "Psychological",
                synopsis: "A mind-bending horror test.",
                imageUrl: "https://example.com/test.jpg"
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("id");
    });
});
