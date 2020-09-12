const express = require('express');
const routes = express.Router();
const passport = require('passport');
const groupValidator = require('../validators/group');
const subgrupValidator = require('../validators/subgroup');
const groupController = require('../controllers/group');

routes.route('/groups') 
    .post(passport.authenticate('jwt', {session: false}), groupValidator.groupValidator, groupController.createGroup)
    .get(passport.authenticate('jwt', {session: false}) , groupController.getGroups);

routes.route('/subgroups')
    .post(passport.authenticate('jwt', {session: false}) , subgrupValidator.subgroupValidator, groupController.createSubgroup)
    .put(passport.authenticate('jwt', {session: false}) , subgrupValidator.memberValidator, groupController.updateSubgroup);
module.exports = routes; 