const express = require('express');

const { AuthController, } = require('../app/Controllers');
const { isLoggedIn } = require('../app/Middlewares');

const Router = express.Router();
const AuthRouter = express.Router();

/*
|-----------------------------------
|   Auth Routes
|-----------------------------------
*/
AuthRouter.post('/register', AuthController.register);
AuthRouter.get('/verify-email/:token', AuthController.verifyEmail);
AuthRouter.post('/login', AuthController.login);

AuthRouter.post('/forgot-password', AuthController.forgotPassword);
AuthRouter.post('/reset-password', AuthController.resetPassword);

AuthRouter.post('/logout', isLoggedIn, AuthController.logout);
AuthRouter.get('/me', isLoggedIn, AuthController.getMe);

Router.use('/auth', AuthRouter);


module.exports = Router;