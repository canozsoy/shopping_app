import express from 'express';
import customerController from '../controllers/customer_controller';
import { verifyJWT } from '../strategies/jwt';

const router = express.Router();

router.use(verifyJWT);

router.route('/order')
  .get(customerController.listAllOrders)
  .post(customerController.createOrder);

router.get('/order/:orderId', customerController.orderDetail);

export default router;
