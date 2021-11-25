import express from 'express';
import indexController from '../controllers/index_controller';

const router = express.Router();

router.post('/login', indexController.loginPost);
router.post('/signup', indexController.signupPost);

export default router;
