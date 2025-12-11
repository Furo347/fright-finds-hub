import sequelize from './db';
import { Admin, Movie } from './models/index';
import bcrypt from 'bcrypt';

async function init() {
  try {
    await sequelize.sync({ force: true });
    console.log('Tables créées avec succès !');

    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'password', 10);
    await Admin.create({ username: process.env.ADMIN_USERNAME || 'admin', password: passwordHash });

    await Movie.bulkCreate([
      { title: 'The Shining', director: 'Stanley Kubrick', year: 1980, rating: 8.4, image_url: '', summary: 'A family heads to an isolated hotel...' },
      { title: 'Psycho', director: 'Alfred Hitchcock', year: 1960, rating: 8.5, image_url: '', summary: 'A Phoenix secretary embezzles money...' },
      { title: 'Alien', director: 'Ridley Scott', year: 1979, rating: 8.4, image_url: 'https://storage.googleapis.com/fright-finds-hub-images/alien.jpg', summary: 'The crew of a commercial spacecraft encounter a deadly lifeform.' },
    ]);

    console.log('Seed terminé');
  } catch (err) {
    console.error('Erreur lors de la création des tables :', err);
  } finally {
    await sequelize.close();
  }
}

init();
