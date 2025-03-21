const express = require('express');
const app = express();
require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectdb = require('./config/dbConnection.js');
connectdb();
const port = process.env.PORT || 3000;
app.use(express.json());
app.get('/',(req,res)=>{
    res.send('Food App');
})
app.use('/auth',require('./routes/authroutes.js'));
app.use('/user',require('./routes/userRoutes.js'));
app.use('/orders',require('./routes/orderRoutes.js'));
app.use('/tableInfo',require('./routes/tableRoutes.js'));
app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})