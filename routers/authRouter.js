const authRouter = require('express').Router();

const authController = require('../controller/authController');
authRouter.post('/register', authController.registerUser);
authRouter.post('/login', authController.loginUser);

module.exports = authRouter;