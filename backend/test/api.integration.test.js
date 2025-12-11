"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
process.env.DB_DIALECT = 'sqlite';
process.env.DB_STORAGE = ':memory:';
process.env.ADMIN_USERNAME = 'testadmin';
process.env.ADMIN_PASSWORD = 'testpassword';
const db_1 = __importDefault(require("../src/db"));
const app_1 = __importDefault(require("../src/app"));
const index_1 = require("../src/models/index");
const bcrypt_1 = __importDefault(require("bcrypt"));
let server;
beforeAll(async () => {
    await db_1.default.sync({ force: true });
    const hash = await bcrypt_1.default.hash('testpassword', 10);
    await index_1.Admin.create({ username: 'testadmin', password: hash });
    server = app_1.default.listen(0); // random ephemeral port
});
afterAll(async () => {
    await db_1.default.close();
    if (server && server.close)
        server.close();
});
describe('Integration API', () => {
    it('GET /api/health returns ok', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get('/api/health');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('ok');
    });
    it('GET /api/movies returns array', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get('/api/movies');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
    it('POST /api/movies requires auth and can create when authenticated', async () => {
        const loginRes = await (0, supertest_1.default)(app_1.default).post('/api/admin/login').send({ username: 'testadmin', password: 'testpassword' });
        expect(loginRes.status).toBe(200);
        const token = loginRes.body.token;
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/movies')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Integration Movie', year: 2025 });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
    });
});
