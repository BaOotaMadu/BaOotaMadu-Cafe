const mongoose = require('mongoose');
const connectdb = async() => {
    try{
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${connect.connection.host}`);
    }catch(error){
        console.log(error);
    }
}
module.exports = connectdb;