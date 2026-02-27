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
    const FRONT = "https://horrordb-front.ew.r.appspot.com";
    if (moviesCount === 0) {
      await Movie.bulkCreate([
        { title: 'The Shining', director: 'Stanley Kubrick', year: 1980, rating: 8.4, image_url: `${FRONT}/assets/shining.jpg`, summary: 'A family heads to an isolated hotel for the winter where an evil and spiritual presence influences the father into violence.' },
        { title: 'Psycho', director: 'Alfred Hitchcock', year: 1960, rating: 8.5, image_url: `${FRONT}/assets/psycho.jpg`, summary: 'A Phoenix secretary embezzles forty thousand dollars from her employer\'s client.' },
        { title: 'Alien', director: 'Ridley Scott', year: 1979, rating: 8.4, image_url: `${FRONT}/assets/alien.jpg`, summary: 'The crew of a commercial spacecraft encounter a deadly lifeform after investigating an unknown transmission.' },
        { title: 'The Exorcist', director: 'William Friedkin', year: 1973, rating: 8.0, image_url: `${FRONT}/assets/exorcist.jpg`, summary: 'When a teenage girl is possessed by a mysterious entity, her mother seeks the help of two priests to save her.' },
        { title: 'Halloween', director: 'John Carpenter', year: 1978, rating: 7.7, image_url: `${FRONT}/assets/halloween.jpg`, summary: 'Fifteen years after murdering his sister on Halloween night, Michael Myers escapes from a mental hospital.' },
        { title: 'A Nightmare on Elm Street', director: 'Wes Craven', year: 1984, rating: 7.5, image_url: `${FRONT}/assets/nightmare.jpg`, summary: 'The monstrous spirit of a slain janitor seeks revenge by invading the dreams of teenagers.' },
        { title: "Rosemary's Baby", director: 'Roman Polanski', year: 1968, rating: 8.0, image_url: `${FRONT}/assets/rosemary.jpg`, summary: "A young woman's husband makes a pact with a satanic cult." },
        { title: 'The Thing', director: 'John Carpenter', year: 1982, rating: 8.1, image_url: `${FRONT}/assets/the_thing.jpg`, summary: 'A research team in Antarctica is hunted by a shape-shifting alien.' },
        { title: 'The Texas Chain Saw Massacre', director: 'Tobe Hooper', year: 1974, rating: 7.4, image_url: `${FRONT}/assets/chainsaw.jpg`, summary: 'A group of friends fall victim to a family of cannibals.' },
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
