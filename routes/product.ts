import express from 'express';
import productController from '../controllers/product_controller';
import { verifyJWT } from '../strategies/jwt';

const router = express.Router();

router.use(verifyJWT);

router.get('/', productController.listAllProducts);

router.get('/:id', productController.getProduct);

export default router;
