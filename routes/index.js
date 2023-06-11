const express = require('express');
const Router = express.Router();
const AuthRouter = express.Router();

const { AuthController, } = require('../app/Controllers');


/*
|-----------------------------------
|   Auth Routes
|-----------------------------------
*/
AuthRouter.post('/register', AuthController.register);
AuthRouter.get('/verify-email/:token', AuthController.verifyEmail);
Router.use('/auth', AuthRouter);


module.exports = Router;