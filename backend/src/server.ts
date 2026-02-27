import app from './app';
import sequelize from './db';
import { Admin, Movie } from './models/index';
import bcrypt from 'bcrypt';

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synchronized');

    // Seed admin if not exists
    const adminExists = await Admin.findOne({ where: { username: process.env.ADMIN_USERNAME || 'admin' } });
    if (!adminExists) {
      const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'password', 10);
      await Admin.create({ username: process.env.ADMIN_USERNAME || 'admin', password: passwordHash });
      console.log('Admin created');
    }

    // Seed movies if empty
    const moviesCount = await Movie.count();
    if (moviesCount === 0) {
      await Movie.bulkCreate([
        { title: 'The Shining', director: 'Stanley Kubrick', year: 1980, rating: 8.4, image_url: '', summary: 'A family heads to an isolated hotel...' },
        { title: 'Psycho', director: 'Alfred Hitchcock', year: 1960, rating: 8.5, image_url: '', summary: 'A Phoenix secretary embezzles money...' },
        { title: 'Alien', director: 'Ridley Scott', year: 1979, rating: 8.4, image_url: 'https://storage.googleapis.com/fright-finds-hub-images/alien.jpg', summary: 'The crew of a commercial spacecraft encounter a deadly lifeform.' },
      ]);
      console.log('Movies seeded');
    }
  } catch (err) {
    console.error('Database initialization error:', err);
    process.exit(1);
  }

  app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
}

startServer();
