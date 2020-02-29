const express = require('express');
const routes = express.Router();
const userController = require('./controller/user-controller');
const passport = require('passport');

routes.get('/', (req, res) => {
    return res.send('This is the API');
});

routes.post('/register', userController.registerUser);
routes.post('/login', userController.loginUser);

routes.get('/special', passport.authenticate('jwt', {session: false}), (req, res) => {
    return res.json({msg: `Hey ${req.user.email}!`});
});

module.exports = routes;