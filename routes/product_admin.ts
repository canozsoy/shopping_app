import express, { Router } from 'express';
import productAdminController from '../controllers/product_admin_controller';
import { adminVerifyJWT, verifyJWT } from '../strategies/jwt';

const router:Router = express.Router();

router.use(verifyJWT);
router.use(adminVerifyJWT);

router.post('/', productAdminController.createProduct);

router.post('/:productId', productAdminController.changeProduct);

export default router;
