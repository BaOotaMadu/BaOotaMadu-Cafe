const usermodel = require("../models/usermodel")
const bcrypt = require("bcryptjs")
//get user info
const getUser = async (req, res) => {
    try{
       const user = await usermodel.findById({_id:req.body.id});
       if(!user){
        return res.status(404).send({
            success:false,
            message:"User not found"
        })
       }
       user.password = undefined;
       res.status(200).send({
           success:true,
           message:"User found",
           user
       })
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"server error"})
    }
}

const updateUser = async (req, res) => {
    try{
       const user = await usermodel.findById({_id:req.body.id});
       if(!user){
        return res.status(404).send({
            success:false,
            message:"User not found"
        })
       }
      const { username,phone } = req.body;
    if(username)
        user.username = username;
    if(phone)
        user.phone = phone;
    await user.save();
    res.status(200).send({
        success:true,
        message:"Updated user",
        user
    })
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"server error"})
    }
}

const resetPassword = async (req,res) => {
    try{
    const {email,newpassword,answer} = req.body;
       if(!email || !newpassword || !answer)
       {
        return res.status(400).send({
        success:false,
        message:"All fields required"
    })
}
   const user = await usermodel.findOne({ email, answer})
     if(!user){
        return res.status(404).send({
            success:false,
            message:"User not found"
        })
       }
       const hashedpassword = await bcrypt.hash(newpassword,10);
       user.password = hashedpassword;
       await user.save();
       res.status(200).send({
        success:true,
        message:"Password updated successfully",
       })  
}
catch(error){
   console.log(error)
        res.status(500).send({
            success:false,
            message:"server error"})
}
}

const deleteUser = async (req,res) => {
    try{
       const user = await usermodel.findByIdAndDelete(req.params.id);
       if(!user){
        return res.status(404).send({
            success:false,
            message:"User not found"
        })
       }
       res.status(200).send({
        success:true,
        message:"User deleted successfully",
       })  
}
catch(error){
   console.log(error)
        res.status(500).send({
            success:false,
            message:"server error"})
}
}

module.exports = { getUser , updateUser , resetPassword , deleteUser }