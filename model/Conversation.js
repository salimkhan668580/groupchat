
const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    ],
    msg: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
            required: true
        }
    ],
    lastmsg:String
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);
