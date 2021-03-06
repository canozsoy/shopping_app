import {
  Model, DataTypes, Optional, Sequelize,
} from 'sequelize';

export interface OrderAttributes {
  id: string,
  date: Date,
  userId: string
}

interface OrderCreationAttributes extends Optional<OrderAttributes, 'id'> {}
interface OrderInstance extends Model<OrderAttributes, OrderCreationAttributes>
  , OrderAttributes {}

export const OrderCreate = (sequelize: Sequelize) => sequelize
  .define<OrderInstance>('order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    unique: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});
