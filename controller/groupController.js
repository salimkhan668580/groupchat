const wrapAsync = require("../utils/wrapAsync");
const Group = require("../model/group.js");


module.exports = {
    createGroup:wrapAsync(async(req,res)=>{
        const { name, participants,image } = req.body;
        if (!name || !participants || participants.length === 0) {
            return res.status(400).json({ error: 'Name and participants are required' });
        }

        const group = new Group({
            name,
            participants,
            image: image || 'https://www.freepik.com/premium-vector/business-man-avatar-vector_382821527.htm#fromView=keyword&page=1&position=6&uuid=eda9d10b-4f0f-46e7-9cff-2b4d4e235aad&query=Profile'
        });
        await group.save();
        return res.status(201).json({ message: 'Group created successfully', group });



    })
}