import express from 'express';
import customerController from '../controllers/customer_controller';

const router = express.Router();

router.route('/:customerId/order')
  .get(customerController.listAllOrders)
  .post(customerController.createOrder);

router.get('/:customerId/order/:orderId', customerController.orderDetail);

export default router;
