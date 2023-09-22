const Course = require('../models/Course');
const Category = require('../models/Category');
const User = require('../models/User');
const {uploadFile} = require("../utils/fileUploader");
require("dotenv").config();

exports.createCourse = async (req, res) => {
    try{
        const userId = req.user.id;

         let {
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            tag,
            category,
            status,
            instructions,
        } = req.body;

         const thumbnail = req.files.thumbnailImage;

         if (
			!courseName ||
			!courseDescription ||
			!whatYouWillLearn ||
			!price ||
			!tag ||
			!thumbnail ||
			!category
		) {
			return res.status(400).json({
				success: false,
				message: "All Fields are Mandatory",
			});
		}
		if (!status || status === undefined) {
			status = "Draft";
		}

        const InstructorDetails = await User.findById(userId,{
            accountType:"Instructor"
        });

        if(!InstructorDetails){
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid Instructor'
            })
        }

        const categoryDetails = await Category.findById(category);

		if (!categoryDetails) {
			return res.status(404).json({
				success: false,
				message: "Category Details Not Found",
			});
		}

        const thumbnailDetails = await uploadFile(thumbnail,process.env.FOLDER_NAME);

        console.log(thumbnailDetails);

        const newCourse = await Course.create({
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            tag,
            category:categoryDetails._id,
            thumbnail: thumbnailDetails.secure_url,
            instructor: InstructorDetails._id,
            status:status,
            instructions,
        });

        await User.findByIdAndUpdate(
            {
                _id:InstructorDetails._id
            },
            {
                $push: {
                    course: newCourse._id
                }
            },
            {new: true},
            );

            //update tag schema
            await Category.findByIdAndUpdate(
                { _id: category },
                {
                    $push: {
                        course: newCourse._id,
                    },
                },
                { new: true }
            );

        res.status(200).json({
            success: true,
            message: 'Course created successfully',
            newCourse,
        })

    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message,
        })
    }

}

exports.getAllCourses = async (req, res) => {
    try{
        const allCourses = await Course.find({},{
            courseName:true,
            price:true,
            thumbnail:true,
            instructor:true,
            ratingAndReviews:true,
            studentEnrolled:true,
            })
            .populate('instructor')
            .exec();

        res.status(200).json({
            success: true,
            message: 'All Courses',
            data: allCourses,
        })

    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message,
        })
    }

}

exports.getCourseDetails = async (req, res) => {
    try {
        const {courseId} = req.body;

        const courseDetails = await Course.findById({
            _id:courseId
        }).populate({
            path:'instructor',
            populate:{
            path:'additionalDetails',
        }}).populate('category')
        .populate({
            path:'courseContent',
            populate:{
                path:'subSection',
            }
        }).exec();

        if(!courseDetails){
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid course id'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Course Details',
            data: courseDetails,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error
        })

    }
}