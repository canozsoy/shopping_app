import express, { Express } from 'express';

import indexRoute from './routes/index';
import productRoute from './routes/product';
import customerRoute from './routes/customer';
import notFoundRoute from './routes/not_found';
import errorHandler from './strategies/error_handler';
import { sequelize } from './models';
import insertAdmin from './models/insert_admin';

const app : Express = express();

(async () => {
  await sequelize.sync({ alter: true });
  await insertAdmin();
})();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', indexRoute);
app.use('/product', productRoute);
app.use('/customer', customerRoute);
app.use('*', notFoundRoute);
app.use(errorHandler);

app.listen(process.env.PORT || 3000);
