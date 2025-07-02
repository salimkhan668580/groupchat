const mongoose = require('mongoose');

const groupConversationSchema = new mongoose.Schema({
    groupId: {      
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        required: true
    }],
    lastMessage: {
        type: String,

    },

}, { timestamps: true  });

const GroupConversation = mongoose.model('GroupConversation', groupConversationSchema);
module.exports = GroupConversation;
