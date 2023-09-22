const {instance} = require('../config/razorpay');
const Course = require('../models/Course');
const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const {courseEnrollmentEmail} = require('../mail/templates/courseEnrollmentEmail');
const mongoose = require('mongoose');
const crypto = require('crypto');

//capture payment and initiate razorpay order
exports.capturePayment = async (req, res) => {
    try{
        const {courseId} = req.body;
        const userId = req.user.id;
        if(!courseId){
            return res.status(400).json({
                success: false,
                msg: 'Please provide a course id'
            });
        }

        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                success: false,
                msg: 'Course not found'
            });
        }

        const uid = new mongoose.Types.ObjectId(userId);

        if(course.students.includes(uid)){
            return res.status(400).json({
                success: false,
                msg: 'You are already enrolled in this course'
            });
        }

        const order = await instance.orders.create({
            amount: course.price * 100,
            currency: 'INR',
            receipt: `receipt_${course._id}_${userId}`,
            notes: {
                userId,
                courseId,
            }
        });

        console.log(order);

        return  res.status(200).json({
            success: true,
            data: order
        });
         
    }catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            msg: 'Unable to complete order'});
    }
}

//verify signature
exports.verifySignature = async (req, res) => {

    try {
        const webhookSecrete = process.env.RAZORPAY_WEBHOOK_SECRET;
        const signature = req.headers['x-razorpay-signature'];

        const shasum =crypto.createHmac('sha256', webhookSecrete);

        shasum.update(JSON.stringify(req.body));

        const digest = shasum.digest('hex');

        if(digest !== signature){
            return res.status(400).json({
                success: false,
                msg: 'Signature mismatch'
            });
        }else{
            console.log('Signature verified');

            const {courseId, userId} =req.body.payload.payment.entity.notes;


            const enrolledCourse = await Course.findByIdAndUpdate({_id:courseId}, {
                $push: {studentEnrolled: userId}
            }, {new: true});

            if(!enrolledCourse){
                return res.status(400).json({
                    success: false,
                    msg: 'course not found'
                });
            }

            console.log(enrolledCourse);

            const  studentCourseList = await User.findByIdAndUpdate({_id:userId}, {
                $push: {courses: courseId}
            }, {new: true});

            console.log(studentCourseList);

           const response =  await mainSender({
                to: studentCourseList.email,
                subject: 'Congrats Course Enrollment Successful',
                text: "Congrats, You are onboarded"
            });

            console.log(response);

           return  res.status(200).json({
                success: true,
                msg: 'verification successful and course added'
            });

        }


    } catch (error) {
       return res.status(500).json({
            success: false,
            msg: error.message,
        });

    }
}