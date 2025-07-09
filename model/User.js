const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
      image: { type: String,
         default: 'https://www.freepik.com/premium-vector/business-man-avatar-vector_382821527.htm#fromView=keyword&page=1&position=6&uuid=eda9d10b-4f0f-46e7-9cff-2b4d4e235aad&query=Profile' 
        },
});

const User = mongoose.model('User', userSchema);

module.exports = User;

