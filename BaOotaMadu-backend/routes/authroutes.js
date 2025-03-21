const express = require('express');
const { registerUser , loginUser } = require('../controller/authController');
const jwt = require('jsonwebtoken');
const router = express.Router();

//routes
//Register POST 
router.post('/register', registerUser );
//Login POST
router.post('/login', loginUser );

module.exports = router