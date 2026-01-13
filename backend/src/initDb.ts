import sequelize from './db';
import { Admin, Movie } from './models/index';
import bcrypt from 'bcrypt';

async function init() {
  try {
    // ⚠️ Ne pas écraser les données existantes en prod, seulement créer si non existant
    await sequelize.sync({ alter: true });
    console.log('Tables créées / mises à jour avec succès !');

    // Vérifie si l’admin existe déjà
    const adminExists = await Admin.findOne({ where: { username: process.env.ADMIN_USERNAME } });
    if (!adminExists) {
      const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'password', 10);
      await Admin.create({ username: process.env.ADMIN_USERNAME || 'admin', password: passwordHash });
    }

    // Seed films seulement si aucun film n’existe
    const moviesCount = await Movie.count();
    if (moviesCount === 0) {
      await Movie.bulkCreate([
        { title: 'The Shining', director: 'Stanley Kubrick', year: 1980, rating: 8.4, image_url: '', summary: 'A family heads to an isolated hotel...' },
        { title: 'Psycho', director: 'Alfred Hitchcock', year: 1960, rating: 8.5, image_url: '', summary: 'A Phoenix secretary embezzles money...' },
        { title: 'Alien', director: 'Ridley Scott', year: 1979, rating: 8.4, image_url: 'https://storage.googleapis.com/fright-finds-hub-images/alien.jpg', summary: 'The crew of a commercial spacecraft encounter a deadly lifeform.' },
      ]);
    }

    console.log('Seed terminé');
  } catch (err) {
    console.error('Erreur lors de la création des tables :', err);
  } finally {
    await sequelize.close();
  }
}

init();
