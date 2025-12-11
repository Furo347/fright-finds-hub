import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';

export interface MovieAttributes {
  id: number;
  title: string;
  director?: string;
  image_url?: string;
  rating?: number;
  year?: number;
  summary?: string;
}

export interface MovieCreationAttributes extends Optional<MovieAttributes, 'id'> {}

export class Movie extends Model<MovieAttributes, MovieCreationAttributes> implements MovieAttributes {
  public id!: number;
  public title!: string;
  public director?: string;
  public image_url?: string;
  public rating?: number;
  public year?: number;
  public summary?: string;
}

Movie.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    director: { type: DataTypes.STRING },
    image_url: { type: DataTypes.STRING },
    rating: { type: DataTypes.FLOAT },
    year: { type: DataTypes.INTEGER },
    summary: { type: DataTypes.TEXT },
  },
  { sequelize, tableName: 'movies' }
);

export interface AdminAttributes {
  id: number;
  username: string;
  password: string;
}
export interface AdminCreationAttributes extends Optional<AdminAttributes, 'id'> {}

export class Admin extends Model<AdminAttributes, AdminCreationAttributes> implements AdminAttributes {
  public id!: number;
  public username!: string;
  public password!: string;
}

Admin.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, tableName: 'admin' }
);

export const db = sequelize;
export default { Movie, Admin, db };

