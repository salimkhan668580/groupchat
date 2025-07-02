const groupRouter = require('express').Router();
const groupController = require('../controller/groupController');

groupRouter.post('/create', groupController.createGroup);

module.exports = groupRouter;