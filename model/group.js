
const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    image: { type: String,
         default: 'https://www.freepik.com/premium-vector/business-man-avatar-vector_382821527.htm#fromView=keyword&page=1&position=6&uuid=eda9d10b-4f0f-46e7-9cff-2b4d4e235aad&query=Profile' 
        },
    createdAt: { type: Date, default: Date.now }
});

const Group = mongoose.model('Group', groupSchema);
module.exports = Group;
