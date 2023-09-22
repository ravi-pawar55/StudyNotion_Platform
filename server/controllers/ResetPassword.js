const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

exports.resetPasswordToken = async (req, res) => {
    try{
        const email = req.body.email;
        const checkUser = await User.findOne({email:email});

        if(!checkUser){
            return res.status(400).json({
                success:false,
                message:'user not found',
            })
        }

        const token = crypto.randomBytes(20).toString('hex');

        const updatedDetails = await User.findOneAndUpdate(
            {email:email},
            {
                token: token,
                resetPasswordExpires:Date.now() + 3600000,
            },
            {new: true});

        const url = `http://localhost:3000/resetPassword/${token}`;

        //send mail
        const sucessMail = await mailSender(email,'Password Reset Link',`Your password reset link is ${url}`);

        res.status(200).json({
            success:true,
            message:'Password reset link sent to your email',
        });
        
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }

}

exports.resetPassword = async (req, res) => {
    try{
    
    const {password,confirmPassword,token} = req.body;

    if(!password || !confirmPassword){
        return res.status(400).json({
            success:false,
            message:'All fields are required',
        })
    }

    if(password !== confirmPassword){
        return res.status(400).json({
            success:false,
            message:'Password and confirm password does not match',
        })
    }

    const userDetails = await User.findOne({token: token});

    if(!userDetails){
        return res.status(400).json({
            success:false,
            message:'Invalid token',
        })
    }

    console.log(userDetails.resetPasswordExpires);
    console.log(Date.now());

    if(!(userDetails.resetPasswordExpires > Date.now())){
        return res.status(403).json({
            success:false,
            message:'Token expired',
        })
    }

    const hashPass = await bcrypt.hash(password,10);

    await User.findByIdAndUpdate({_id:userDetails._id},{password:hashPass},{new:true});

    return res.status(200).json({
        success:true,
        message:"password reset sucessful",
    });

     }catch(err){
        res.status(500).json({
            success:false,
            message:"something went wrong",
            error:err.message,
        })
     }

}
