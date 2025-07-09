
const msgRouter = require('express').Router();
const messageController = require('../controller/messageController');

msgRouter.get('/messages', messageController.getMessages);
msgRouter.get('/get-user', messageController.getUsers);
msgRouter.get('/getUserDetails', messageController.getUserDetails);

// msgRouter.delete('/messages/:id', messageController.deleteMessage);

module.exports = msgRouter;
