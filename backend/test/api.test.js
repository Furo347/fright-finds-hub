"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
jest.mock('../src/models/movieModel', () => ({
    getAllMovies: jest.fn(async () => [{ id: 1, title: 'Mock Movie' }]),
    createMovie: jest.fn(async (movie) => ({ id: 2, ...movie })),
    deleteMovie: jest.fn(async (id) => undefined),
}));
jest.mock('../src/models/adminModel', () => ({
    getAdminByUsername: jest.fn(async (username) => ({ id: 1, username, password: '$2b$10$abcdefghijklmnopqrstuv' })),
}));
describe('API Routes', () => {
    it('GET /api/health should return 200', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get('/api/health');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('ok');
    });
    it('GET /api/movies should return an array of movies', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get('/api/movies');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
    it('POST /api/movies should require authentication', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/movies')
            .send({ title: 'Test Movie' });
        expect(res.statusCode).toBe(401);
    });
    it('POST /api/movies should create a new movie when authenticated', async () => {
        const jwt = require('jsonwebtoken');
        const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET || 'secret');
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/movies')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Integration Test Movie' });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
    });
});
