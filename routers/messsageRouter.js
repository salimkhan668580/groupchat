
const msgRouter = require('express').Router();
const messageController = require('../controller/messageController');

msgRouter.get('/messages', messageController.getMessages);

// msgRouter.delete('/messages/:id', messageController.deleteMessage);

module.exports = msgRouter;
