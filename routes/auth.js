const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
router.get('/register',authController.getRegister);
router.post('/register',authController.postRegister);
router.get('/login',authController.getLogin);
router.post('/login',authController.postLogin);
router.post('/logout',authController.postlogout);
router.get('/reset',authController.getReset);
router.post('/reset',authController.postReset);
router.get('/reset/:token',authController.getForgotPassword);
router.post('/forgotpassword',authController.postForgotPassword);
module.exports = router;