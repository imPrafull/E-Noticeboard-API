const express = require('express');
const routes = express.Router();
const passport = require('passport');
const validator = require('../validators/post');
const postController = require('../controllers/post');

routes.route('/posts') 
    .post(passport.authenticate('jwt', {session: false}), validator.postValidator, postController.createPost)
    .get(passport.authenticate('jwt', {session: false}) , postController.getPosts);

module.exports = routes;