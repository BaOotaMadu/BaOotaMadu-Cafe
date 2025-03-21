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
app.use('/auth',require('./routes/authroutes'));
app.use('/user',require('./routes/userRoutes'));
app.use('/orders',require('./routes/orderRoutes'));
app.use('/tableInfo',require('./routes/tableRoutes'));
app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})