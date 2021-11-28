import express, { Express } from 'express';

import indexRoute from './routes/index';
import productRoute from './routes/product';
import productAdminRoute from './routes/product_admin';
import userAdminRoute from './routes/user_admin';
import customerRoute from './routes/customer';
import notFoundRoute from './routes/not_found';
import errorHandler from './strategies/error_handler';
import { sequelize } from './models';
import insertAdmin from './models/insert_admin';
import logMiddleware from './logs/log_middleware';

const app : Express = express();

(async () => {
  await sequelize.sync({ alter: true });
  await insertAdmin();
})();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logMiddleware);
app.use('/', indexRoute);
app.use('/product', productRoute);
app.use('/product-admin', productAdminRoute);
app.use('/user-admin', userAdminRoute);
app.use('/customer', customerRoute);
app.use('*', notFoundRoute);
app.use(errorHandler);

app.listen(process.env.PORT || 3000);
