import {
  Model, DataTypes, Optional, Sequelize,
} from 'sequelize';

export interface UserAttributes {
  id: string,
  username: string,
  password: string,
  role: string
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}
interface UserInstance extends Model<UserAttributes, UserCreationAttributes> {}

export const UserCreate = (sequelize:Sequelize) => sequelize.define<UserInstance>('user', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
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
