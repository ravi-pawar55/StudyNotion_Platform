const User = require('../models/User');
const OTP = require('../models/OTP');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Profile = require('../models/Profile');
const {passwordUpdated} = require('../mail/templates/passwordUpdate');
const mailSender = require('../utils/mailSender');
require('dotenv').config();

//sendOTP
exports.sendotp = async (req, res) => {
    try{
    const {email} = req.body;

    const checkUserPresent = await User.findOne({email});

    if(checkUserPresent){
        return res.status(401).json({
            success: false,
            message: 'User already exists',
        });
    }

    let otp = otpGenerator.generate(6, { 
        upperCaseAlphabets: false,
        lowerCaseAlphabets:false ,
        specialChars: false 
    });

    const checkUniqueOTP = await OTP.findOne({otp:otp});

    while(checkUniqueOTP){
        otp = otpGenerator.generate(6, { 
            upperCaseAlphabets: false,
        });
    }

    const otpPayload = {email,otp};

    console.log(otpPayload);

    const otpBody = await OTP.create(otpPayload);

    console.log(otpBody);

    res.status(200).json({
        success: true,
        message: 'OTP sent successfully',
        otp,
    });

}catch(err){
     console.log(error);
     return res.status(500).json({
            success: false,
            message: error,message,
        });
}
};

//sighUp
exports.signup = async (req, res) => {
    try{
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body;

        if(
            !firstName || 
            !lastName || 
            !email || 
            !password || 
            !confirmPassword || 
            !otp
            ) {
            return res.status(403).json({
                success: false,
                message: 'All fields are required',
            });
        }

        if(password!==confirmPassword){
            return res.status(400).json({
                success:false,
                message: 'Password and confirm password does not match',
            });
        }

        const existingUser = await User.findOne({email});

        if(existingUser){
            return  res.status(400).json({
                success:false,
                message: 'User Already Exists',
            });
        }

        const recentOTP = await OTP.find({email}).sort({createdAt: -1}).limit(1);

        console.log(recentOTP);

        if(recentOTP.length===0){
            return res.status(400).json({
                success:false,
                message: 'Please generate OTP first',
            })
        }else if(otp!==recentOTP[0].otp){
            return res.status(400).json({
                success:false,
                message: 'Please enter valid OTP',
            })
        }

        const hashPassword = await bcrypt.hash(password, 10);

        let approved ='';

        approved ==='Instructor' ? (approved=false):(approved=true);

        const profile = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,

        });

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashPassword,
            accountType,
            approved:approved,
            additionalDetails: profile._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        });

        return res.status(200).json({
            success:true,
            message:'user created successfully',
            data: user,
        }); 

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: 'User Registrtion Fail',
        });
    }
};

//login
exports.login = async (req, res) => {
    try{
       const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }

        const user = await User.findOne({email}).populate('additionalDetails');

        if(!user){
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials or user is not registered',
            });
        }

        if(await bcrypt.compare(password, user.password)){
            const token = jwt.sign(
				{ 
                    email: user.email,
                    id: user._id,
                    accountType: user.accountType
                },
				process.env.JWT_SECRET,
				{
					expiresIn: "24h",
				}
			);

            user.token = token;
            user.password = undefined;

            console.log(user.token);

            const options = {
                expires: new Date(Date.now() + 1000*60*60*24*3),
                httpOnly: true,
            }

            res.cookie('token',token,options).status(200).json({
                success:true,
                token,
                user,
                message:'login succesful',
            });
        }else{
            return res.status(401).json({
                success: false,
                message: 'Invalid password',
            });
        }

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: 'Login Failure',
        });
    }
}

//changePassword
exports.changePassword = async (req, res) => {
    try{

        const userDetails = await User.findById(req.user.id);

        const {oldPassword,newPassword,confirmNewPassword} = req.body;

        const isPasswordMatch = await bcrypt.compare(
            oldPassword,
            userDetails.password
        );

        if(!isPasswordMatch){
            return res.status(401).json({
                success:false,
                message:'The Password is incorrect'
            })
        }

       if(!oldPassword || !newPassword || !confirmNewPassword){
           return res.status(400).json({
               success:false,
               message: 'All fields are required',
           })
        }

        if(newPassword!==confirmPassword){
            return res.status(400).json({
                success:false,
                message: 'Password and confirm password does not match',
            })
        }

        const encryptedPassword = await bcrypt.hash(newPassword,10);
        const updatedUserDetails = await User.findByIdAndUpdate(req.user.id,
             {password:encryptedPassword},
             {new:true}
        );

        try{
        //send mail
        const emailResponse = await mailSender(
            updatedUserDetails.email,
            passwordUpdated(
                updatedUserDetails.email,
                `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
            )
        );

        console.log("Email sent successfully:", emailResponse.response);
    }catch(error){
        console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
    }

       return  res.status(200).json({
            success:true,
            message:'Password changed successfully',
        });

    
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: 'Error Occured while updating password',
            error:err,
        });
    }
}
