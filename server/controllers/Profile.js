const Profile = require('../models/Profile');
const User = require('../models/User');
const {uploadFile} = require('../utils/fileUploader');

exports.updateProfile = async (req, res) => {
   try{
        const {gender,dateOfBirth="",about="",contactNumber} = req.body;
        const userId = req.user.id;

        if(!contactNumber || !gender || !userId){
            return res.status(400).json({
                success: false,
                message: 'Please provide all the fields'
            })
        }

        const userDetails = await User.findById(userId);

        if(!userDetails){
            res.status(400).json({
                success: false,
                message: 'Please provide a valid user'
            })
        }

        const profileID = userDetails.additionalDetails;

        const profileDetails = await Profile.findById(profileID);

        if(!profileDetails){
            res.status(400).json({
                success: false,
                message: 'Please provide a valid profile'
            })
        }

        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.contactNumber = contactNumber;
        profileDetails.gender = gender;

        await profileDetails.save();

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: profileDetails
        })
        
   }catch(err){
         console.log(err);
         return res.status(500).json({
              success: false,
              message: err.message,
         })
   }
}

exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;

        if(!userId){
            return res.status(400).json({
                success: false,
                message: 'Please provide all the fields'
            })
        }

        const user = await User.findById({_id:userId});

        if(!user){
            res.status(400).json({
                success: false,
                message: 'Please provide a valid user'
            })
        }

        const unEnroll = await Course.findByIdAndDelete({enrolledStudents:userId});

        const profileID = user.additionalDetails;

        const deleteProfile = await Profile.findByIdAndDelete({_id:profileID});

        const deleteUser = await User.findByIdAndDelete({_id:userId});

        return res.status(200).json({
            success: true,
            message: 'Account deleted successfully',
            data: deleteProfile
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'User cannot deleted',
            error:error.message,
        })
    }

}

exports.getAllUserDetails = async (req, res) => {

    try{
        const userId = req.user.id;

        if(!userId){
            return res.status(400).json({
                success: false,
                message: 'Please provide all the fields'
            })
        }

        const userDetails = await User.findById(userId)
            .populate('additionalDetails') // Correct field name
            .exec();

        res.status(200).json({
            success: true,
            message: 'User details fetched successfully',
            data: userDetails
        })

    }catch(err){
        console.log(err);
        return res.status(500).json({
             success: false,
             message: err.message,
        })
    }

}

exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await uploadFile(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};
  
exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      const userDetails = await User.findOne({
        _id: userId,
      })
        .populate("courses")
        .exec()
      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};