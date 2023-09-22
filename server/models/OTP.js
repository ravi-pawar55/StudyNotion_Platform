const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');
const emailTemplate = require('../mail/templates/emailVerificationTemplate')

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 5*60,
    },
});


//function to send emails
async function sendVerificationMail(email, otp) {
    try {
        const mailResponse = await mailSender(
            email,
            "Verification Email",
            emailTemplate(otp),
        );
        console.log('Mail sent successfully',mailResponse.response);
    } catch (error) {
        console.log('Error occured while sending mail',error);
    }
};

//post-save hook to send email after document has been saved
OTPSchema.pre("save", async function(next) {
    console.log("New Document saved to db");
    if(this.isNew){
        await sendVerificationMail(this.email, this.otp);
    }
    next();
});


const OTP = mongoose.model('OTP', OTPSchema);

module.exports = OTP;

