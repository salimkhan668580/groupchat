const express = require('express');
const app = express();
const cors = require('cors');

const connectDB = require('./lib/dbConnect.js');
const socketConnect = require('./lib/socket.js');
const PORT= process.env.PORT || 8080;
require('dotenv').config();
const { createServer } =require('http')
const autRouter= require('./routers/authRouter.js');
const messageRouter = require('./routers/messsageRouter.js');
const responseHandler = require('./utils/responseHandler.js');
const groupRouter = require('./routers/groupRouter.js');


connectDB();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/api/auth', autRouter);
app.use("/api/message",messageRouter);
app.use("/api/group",groupRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});



app.use((err, req, res, next) => {
  console.error(err);
  responseHandler.responseWithError(res, 500, 'Internal Server Error');
});

const httpServer = createServer(app);
socketConnect(httpServer);
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
