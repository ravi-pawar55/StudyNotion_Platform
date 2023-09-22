const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');

//auth
exports.auth = async (req, res, next) => {
    try{
        //extract token
        console.log(req.cookies);
        console.log(req.body);
        const token = req.cookies.token 
                        || req.body.token 
                        || req.header("Authorization").replace("Bearer ", "");

        console.log("Token : ",token);                

        if(!token) {
            return res.status(401).json({
                success:false,
                message:'Token is missing',
            });
        }

        //verify the token
        try{
            const decode =  jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }
        catch(err) {
            return res.status(401).json({
                success:false,
                message:'token is invalid',
            });
        }
        next();
    }
    catch(error) {  
        return res.status(401).json({
            success:false,
            message:'Something went wrong while validating the token',
        });
    }
}

//isStudent
exports.isStudent = async (req, res, next) => {
     try{
        if(req.user.accountType === 'Student'){
            next();
        }else{
            return res.status(401).json({
                success:false,
                message:'User cannot verified, This is Protected Route for Student',
            })
        }
    }catch(err){
        return res.status(500).json({
            success:false,
            message:'user cannot verified, please try again',
        })
    }
}

//isInstructor
exports.isInstructor = async (req, res, next) => {
    try{
       if(req.user.accountType === 'Instructor'){
           next();
       }else{
           return res.status(401).json({
               success:false,
               message:'user cannot verified, This is Protected Route for Instructor',
           })
       }
    }catch(err){
       return res.status(500).json({
           success:false,
           message:'user cannot verified, please try again',
       })
    }
}

//isAdmin
exports.isAdmin = async (req, res, next) => {
    try{
       if(req.user.accountType === 'Admin'){
           next();
       }else{
           return res.status(401).json({
               success:false,
               message:'user cannot verified, This is Protected Route for Admin',
           })
       }
    }catch(err){
       return res.status(500).json({
           success:false,
           message:'user cannot verified, please try again',
       })
    }
}
