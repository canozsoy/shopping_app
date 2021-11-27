import express from 'express';
import userAdminController from '../controllers/user_admin_controller';
import { adminVerifyJWT, verifyJWT } from '../strategies/jwt';

const router = express.Router();

router.use(verifyJWT);
router.use(adminVerifyJWT);

router.route('/')
  .get(userAdminController.getUsers)
  .post(userAdminController.postUser);

export default router;
