import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.USERNAME as string,
  process.env.PASSWORD as string,
  {
    host: 'localhost',
    dialect: 'postgres',
  },
);

export default sequelize;
