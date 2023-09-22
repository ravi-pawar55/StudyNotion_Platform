const RatingAndReview = require('../models/RatingAndReview');
const Course = require('../models/Course');
const mongoose = require('mongoose');

exports.createRating = async (req, res) => {
    try{
        const userID = req.user.id;

        const {courseId, rating, review} = req.body;

        if(!courseId || !rating || !review){
            return res.status(400).json({
                success: false,
                message: 'Please provide all the fields'
            })
        }

        const courseDetails = await Course.findOne({
            _id: courseId
        ,studentEnrolled: { $elemMatch: { $eq: userID } }});

        if(!courseDetails){
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid course id'
            })
        }

        const userAlredyRated = await RatingAndReview.findOne({
            course: courseId,
            user: userID
        });

        if(userAlredyRated){
            return res.status(400).json({
                success: false,
                message: 'You have already rated this course'
            })
        }

        const ratingAndReviews = await RatingAndReview.create({
            course: courseId,
            user: userID,
            rating: rating,
            review: review
        });

        const courseRating = await Course.findOneAndUpdate({
            _id: courseId
        },{
            $push: {ratingAndReviews: ratingAndReviews._id}
        },{
            new: true
        });

        return res.status(200).json({
            success: true,
            message: 'Rating and Review added successfully',
            data: courseRating
        })

    }catch(err){
        res.status(500).json({
            success: false,
            message: err
        })
    }
}

exports.getAverageRating = async (req, res) => {

    try {
        const {courseId} = req.body;

        const result = await RatingAndReview.aggregate([
            {
                $match: {
                    course: new mongoose.Types.ObjectId(courseId)
                }
            },
            {
                $group: {
                    _id: null,
                    averageRating: {
                        $avg: '$rating'
                    }
                }
            }
        ]);

        if(result.length === 0){
            return res.status(400).json({
                success: false,
                message: 'No rating found'
            })
        }

        const averageRating = result[0].averageRating;
        
        return res.status(200).json({
            success: true,
            message: 'Average Rating',
            data: averageRating,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
        
    }

}

//getAllRatingAndReviews
exports.getAllRatingAndReview = async (req, res) => {
    try {
        const allRatingAndReview = await RatingAndReview.find({})
        .sort({rating:'desc'})
        .populate({
            path:'user',
            select:'firstName lastName email image'
        }).populate({
            path:'course',
            select:'courseName'
        }).exec();

        if(!allRatingAndReview){
            return res.status(400).json({
                success: false,
                message: 'No Rating and Review found'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'All Rating and Review',
            data: allRatingAndReview,
        })
        

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}