import request from 'supertest';

process.env.DB_DIALECT = 'sqlite';
process.env.DB_STORAGE = ':memory:';
process.env.ADMIN_USERNAME = 'testadmin';
process.env.ADMIN_PASSWORD = 'testpassword';

import sequelize from '../src/db';
import app from '../src/app';
import { Admin, Movie } from '../src/models/index';
import bcrypt from 'bcrypt';

let server: any;

beforeAll(async () => {
  await sequelize.sync({ force: true });
  const hash = await bcrypt.hash('testpassword', 10);
  await Admin.create({ username: 'testadmin', password: hash });
  server = app.listen(0); // random ephemeral port
});

afterAll(async () => {
  await sequelize.close();
  if (server && server.close) server.close();
});

describe('Integration API', () => {
  it('GET /api/health returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('GET /api/movies returns array', async () => {
    const res = await request(app).get('/api/movies');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/movies requires auth and can create when authenticated', async () => {
    const loginRes = await request(app).post('/api/admin/login').send({ username: 'testadmin', password: 'testpassword' });
    expect(loginRes.status).toBe(200);
    const token = loginRes.body.token;

    const res = await request(app)
      .post('/api/movies')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Integration Movie', year: 2025 });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });
});

