const express = require('express');
const routes = express.Router();
const userController = require('../controllers/user');
const passport = require('passport');
const validator = require('../validators/auth');

routes.get('/', (req, res) => {
    return res.send('This is the API');
});

routes.post('/register', validator.authValidator, userController.registerUser);
routes.post('/login', validator.authValidator, userController.loginUser);
routes.get('/confirmation', userController.confirmationGet);
routes.get('/resend', userController.resendTokenGet);
routes.get('/userDetails', passport.authenticate('jwt', {session: false}), userController.userDetails);

module.exports = routes;