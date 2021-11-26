import { Model, DataTypes } from 'sequelize';
import sequelize from './config';

export interface UserAttributes extends Model {
  id: number,
  username: string,
  password: string,
  role: string
}

export const User = sequelize.define<UserAttributes>('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    unique: true,
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: false,
  },
  role: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: false,
  },
});
