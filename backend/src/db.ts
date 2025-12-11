import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const dialect = (process.env.DB_DIALECT as any) || 'mysql';

const sequelize =
  dialect === 'sqlite'
    ? new Sequelize({
        dialect: 'sqlite',
        storage: process.env.DB_STORAGE || ':memory:',
        logging: false,
      })
    : new Sequelize(
        process.env.DB_NAME || '',
        process.env.DB_USER || '',
        process.env.DB_PASSWORD || '',
        {
          host: process.env.DB_HOST || '127.0.0.1',
          dialect: 'mysql',
          logging: false,
        }
      );

export default sequelize;
