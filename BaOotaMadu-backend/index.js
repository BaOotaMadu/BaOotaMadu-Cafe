const express = require('express');
const cors = require("cors");
const app = express();
require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectdb = require('./config/dbConnection.js');
connectdb();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors()); 
app.get('/',(req,res)=>{
    res.send('Food App');
})
app.use('/auth',require('./routes/authroutes.js'));
app.use('/user',require('./routes/userRoutes.js'));
app.use('/orders',require('./routes/orderRoutes.js'));
app.use('/tableInfo',require('./routes/tableRoutes.js'));
app.use("/menu", require("./routes/menuRoutes.js"));
app.use("/insights", require("./routes/insightsRoutes"));
app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})