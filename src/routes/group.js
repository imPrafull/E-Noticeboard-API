const express = require('express');
const routes = express.Router();
const passport = require('passport');
const validator = require('../validators/group');
const groupController = require('../controllers/group');

routes.route('/groups') 
    .post(passport.authenticate('jwt', {session: false}), validator.groupValidator, groupController.createGroup)
    .get(passport.authenticate('jwt', {session: false}) , groupController.getGroups);

routes.route('/subgroups')
    .post(passport.authenticate('jwt', {session: false}) , groupController.createSubgroup)
    .put(passport.authenticate('jwt', {session: false}) , groupController.updateSubgroup);
module.exports = routes;