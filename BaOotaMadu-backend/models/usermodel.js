const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    phone:{type:String,required:true},
    userType:{
        type:String,
        required:true,
        default:"customer",
        enum:["customer","manager"]},
    profilePic:{
        type:String,
        default:"https://icon-library.com/images/generic-user-icon/generic-user-icon-9.jpg"
    },
    answer:{
        type:String,
        required:[true,"Answer is required"]
    },
},
{timestamps:true})
module.exports = mongoose.model("User",userSchema);
