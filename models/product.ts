import {
  Model, DataTypes, Optional, Sequelize,
} from 'sequelize';

export interface ProductAttribution {
  id: string,
  name: string,
  price: number,
  detail: string,
}

interface ProductCreationAttributes extends Optional<ProductAttribution, 'id'> {}
interface ProductInstance extends Model<ProductAttribution, ProductCreationAttributes> {}

export const ProductCreate = (sequelize:Sequelize) => sequelize
  .define<ProductInstance>('product', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    unique: false,
  },
  detail: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: false,
  },
});
