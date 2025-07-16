

const User = require('../model/User');
const bcrypt = require('bcryptjs');
const responseHandler = require('../utils/responseHandler');
const wrapAsync = require('../utils/wrapAsync');

module.exports = {
    registerUser: wrapAsync(async (req, res) => {
        try {
            const { name, email, password } = req.body;

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return responseHandler.responseWithError(res, 400, 'User already exists');
   
            }
            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            // Create user
            const newUser = new User({ name, email, password: hashedPassword });
            await newUser.save();
            responseHandler.responseWithMessage(res, 201, 'User registered successfully');
        } catch (err) {
            responseHandler.responseWithError(res, 500, err.message);
        }
    }),
    loginUser: wrapAsync(async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email }).lean();
            if (!user) {
                return responseHandler.responseWithError(res, 400, 'Invalid credentials');
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return responseHandler.responseWithError(res, 400, 'Invalid credentials');
            }
 
            const jwt = require('jsonwebtoken');
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
          
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000 
            });
            
            const data={
                token,
                user
            }
            responseHandler.responseWithData(res, 200, 'User logged in successfully', data);
        } catch (err) {
            responseHandler.responseWithError(res, 500, err.message);
        }
    })
}