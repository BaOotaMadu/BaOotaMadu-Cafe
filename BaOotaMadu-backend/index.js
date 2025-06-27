const express = require('express');
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectdb = require('./config/dbConnection.js');

const app = express();
const server = http.createServer(app); // HTTP server for socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // adjust for production
  },
});

connectdb();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors()); 

require('./models/restaurantModel.js');
require('./models/tableModel.js');
require('./models/orderModel.js');
require('./models/activityModel.js');

app.get('/', (req, res) => {
  res.send('Food App');
});

app.use('/auth', require('./routes/authroutes.js'));
app.use('/user', require('./routes/userRoutes.js'));
app.use('/orders', require('./routes/orderRoutes.js')(io)); // pass io
app.use('/tables', require('./routes/tableRoutes.js'));
app.use('/menu', require('./routes/menuRoutes.js'));
app.use('/insights', require('./routes/insightsRoutes'));
app.use("/activities", require("./routes/activityRoutes"));


// Socket.IO connection listener
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
