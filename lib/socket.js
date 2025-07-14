const https= require('https');
const Conversation = require('../model/Conversation');
const responseHandler = require('../utils/responseHandler');
const Message = require('../model/Message');
const GroupConversation = require('../model/groupConversation');
const wrapAsync = require('../utils/wrapAsync');
const Group = require('../model/group');

const socketConnect=(httpServer)=>{
   
    const io = require('socket.io')(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });
    


    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });

     socket.on('join_room', async (data) => {
             const [senderId, receiverId] = data.room.split("-");
                const sortedIds = [senderId, receiverId].sort();
                const room_Id = `${sortedIds[0]}-${sortedIds[1]}`;
                socket.join(room_Id);

        try {
                const newConversation= await Conversation.findOne({ participants: { $all: [sortedIds[0], sortedIds[1]] } });
                if (!newConversation) {
                    const conversation = new Conversation({
                        participants: [sortedIds[0], sortedIds[1]],
                        msg: []
                    });
                 
    
                await conversation.save();
                }
          
                socket.join(data.room);
                socket.emit('notification',"room joined successfully");
        } catch (error) {
            console.error(error);
            
        }
     });

     socket.on('send_msg', async(data) => {
           const { senderId, receiverId, msg } = data;
             const sortedIds = [senderId, receiverId].sort();
             const room_Id = `${sortedIds[0]}-${sortedIds[1]}`;


try {
    
                 const newMessage = new Message({
                    senderId,
                    receiverId,
                    msg
                });
    
                await newMessage.save();
                await Conversation.findOneAndUpdate(
                    { participants: { $all: [sortedIds[0], sortedIds[1]] } },
                    { $push: { msg: newMessage._id }, lastmsg: msg },
                    { new: true }
                );
    
                io.to(room_Id).emit('rcv_msg', {
    lastmsg: msg,
    messages: [
        {
            _id: newMessage._id,
            senderId,
            receiverId,
            msg,
            createdAt: newMessage.createdAt
        }
    ]
});
//    socket.to(room_Id).emit('rcv_msg', {
//     lastmsg: msg,
//     messages: [
//         {
//             _id: newMessage._id,
//             senderId,
//             receiverId,
//             msg,
//             createdAt: newMessage.createdAt
//         }
//     ]
// });

} catch (error) {
    console.error(error);
    
}
            // ==broadcast msg sender and reciver both.
            // socket.broadcast.to(room_Id).emit('rcv_msg', msg);

        });

     socket.on('join_group', async (data) => {
            const {groupId}=data;

             const group = await Group.findOne({ groupId });
                if (!group) {
                    socket.emit('socket_error', {
                        type: 'group_not_found',
                        message: `Group conversation with ID ${groupId} not found.`
                    });
                    return;
                }

            socket.join(groupId);

            const groupConversation = await Conversation.findOne({ _id: groupId });
                if(!groupConversation) {
                    const newGroupConversation = new GroupConversation({
                        groupId,
                        messages: [],
                        lastMessage: ''
                    }
                );

                    await newGroupConversation.save();
                }
        });

        socket.on('send_group_msg',  wrapAsync(async (data) => {
                const { groupId, senderId, msg } = data;
                const groupConversation = await GroupConversation.findOne({ groupId });
                if (!groupConversation) {
                    socket.emit('socket_error', {
                        type: 'group_not_found',
                        message: `Group conversation with ID ${groupId} not found.`
                    });
                    return;
                }
     const newMessage = new Message({
                    senderId,
                    receiverId: groupId,
                    msg
                });
    
                await newMessage.save();
              
            const updatedGroup = await GroupConversation.findOneAndUpdate(
            { groupId },
            { $push: { messages: newMessage._id }, lastMessage: msg },
            { new: true }
        );

         if (!updatedGroup) {
            socket.emit('socket_error', {
            type: 'group_not_found',
            message: `Group conversation with ID ${groupId} not found.`
            });
            return;
        }

             


            io.to(groupId).emit('rcv_group_msg', { senderId, msg });
            }));

     });


}

module.exports = socketConnect;
