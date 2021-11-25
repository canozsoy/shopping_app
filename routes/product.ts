import express from 'express';
import productController from '../controllers/product_controller';

const router = express.Router();

router.route('/')
  .get(productController.listAllProducts)
  .post(productController.createProduct);

router.route('/:id')
  .get(productController.getProduct)
  .post(productController.changeProduct);

export default router;
