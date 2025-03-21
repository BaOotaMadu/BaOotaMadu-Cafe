const usermodel = require('../models/usermodel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const registerUser = async(req,res) => {
    try{
        const {
            username,
            email,
            password,
            phone,
            userType,
            answer
        } = req.body;
        if(!username || !email || !password || !phone || !userType || !answer){
            return res.send({
               success:false,
               message:"All fields are required",
            });
        }
        //check user
        const existing = await usermodel.findOne({email});
        if(existing)
        {
            res.status(500).send({
                success:false,
                message:"User already exists please login"
            })
        }
        const Hashedpassword = await bcrypt.hash(password,10);
        //create user
        const user = await usermodel.create({
            username,
            email,
            password:Hashedpassword,
            phone,
            userType,
            answer
        });
        res.status(201).send({
            success:true,
            message:"User registered successfully",
            user
        })

}
catch(error){
    console.log(error);
    res.send("Unsuccessful registration")
}
}


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: "All fields are required",
            });
        }

        // Check if user exists
        const existing = await usermodel.findOne({ email });
        if (!existing) {
            return res.status(401).send({
                success: false,
                message: "User not found",
            });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, existing.password);
        if (!isMatch) {
            return res.status(401).send({
                success: false,
                message: "Wrong password",
            });
        }
         const token = jwt.sign({ id: existing._id }, process.env.SECRET_key, {
             expiresIn: "5d",
         })
        // Remove password before sending response
        existing.password = undefined;

        return res.status(200).send({
            success: true,
            message: "User logged in successfully",
            token,
            user: existing,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Server error" });
    }
};

module.exports = { registerUser , loginUser };