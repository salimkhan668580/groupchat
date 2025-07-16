const wrapAsync = require("../utils/wrapAsync");
const conversationModel = require("../model/Conversation");
const responseHandler = require("../utils/responseHandler");
const { default: mongoose } = require("mongoose");
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const Group = require("../model/group");


module.exports={


    getMessages: wrapAsync(async (req, res) => {
        const { sender, receiver } = req.query;
        if (!sender || !receiver) {
            return responseHandler.responseWithError(res, 400, 'Sender and receiver are required');
        }
                const senderObjId = new mongoose.Types.ObjectId(sender);
                const receiverObjId = new mongoose.Types.ObjectId(receiver);
        const messagesAggregation=await conversationModel.aggregate([
             {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $match: {
                    participants: { $all: [senderObjId, receiverObjId] }
                }
            },
            {
                $lookup: {
                    from: 'messages',
                    localField: 'msg',
                    foreignField: '_id',
                    as: 'messages'
                }
            },
            {
                $project: {
                    _id: 0,
                    messages: 1,
                    lastmsg: 1
                }
            }
           
            
        ]);


        return responseHandler.responseWithData(res, 200, 'Messages retrieved successfully', messagesAggregation);
    }),

    getUsers: wrapAsync(async (req, res) => {
        const {token} = req.cookies;
        if (!token) {
            return responseHandler.responseWithError(res, 401, 'Unauthorized');
        }
       const {id} = jwt.verify(token, process.env.JWT_SECRET);
        
        const users = await User.find();
    //    const group=await Group.aggregate([
    //         { 
    //             $match: {
    //                 participants: { $all: [id] }
    //             }  
    //    }]); 
        const group = await Group.find({ participants: id });
        const data=[...users,...group];
        // return responseHandler.responseWithData(res, 200, 'Users retrieved successfully', users);
        return responseHandler.responseWithData(res, 200, 'Users retrieved successfully', data);
    }),
    getUserDetails: wrapAsync(async (req, res) => {
        const { id } = req.query;
        const user = await User.findById(id).select('-password').lean();
        return responseHandler.responseWithData(res, 200, 'Users retrieved successfully', user);
    }),
    

}