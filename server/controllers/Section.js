const Section = require('../models/Section');
const Course = require('../models/Course');

exports.createSection = async (req, res) => {
   try{
        const {sectionName,courseId} = req.body;
        
        if(!sectionName || !courseId){
            return res.status(400).json({
                success: false,
                message: 'Please provide all the fields'
            })
        }

        const newSection = await Section.create({
            sectionName
        });

        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {$push: {section: newSection._id}},
            {new: true},
            ).populate({
				path: "courseContent",
				populate: {
					path: "subSection",
				},
			})
			.exec();

        return res.status(200).json({
            success: true,
            message: 'Section created successfully',
            updatedCourseDetails,
            data: newSection
        })


   }catch(err){
         console.log(err);
         return res.status(500).json({
              success: false,
              message: 'Internal Server Error',
              error:err.message
         })
   }
}


exports.updateSection = async (req, res) => {
     try{
        const {sectionName,sectionId} = req.body;
         

        if(!sectionName){
            return res.status(400).json({
                success: false,
                message: 'Please provide all the fields'
            })
        }

        const updatedSection = await Section.findByIdAndUpdate(
            sectionId,
            {sectionName},
            {new: true},
            );

        return res.status(200).json({
            success: true,
            message: 'Section updated successfully',
            data: updatedSection
        })

     }catch(err){
            console.log(err);
            return res.status(500).json({
                 success: false,
                 message: 'Internal Server Error'
            })
    }
}

exports.deleteSection = async (req, res) => {
    try{
     const {sectionId} = req.params;


     if(!sectionId){
         return res.status(400).json({
             success: false,
             message: 'Please provide all the fields'
         })
     }

     const deletedSection = await Section.findByIdAndDelete(sectionId);

     //const updateCourse = await Course.findByIdAndDelete(sectionID);

        return res.status(200).json({
            success: true,
            message: 'Section deleted successfully',
            data: deletedSection
        })

    }catch(err){
        console.log(err);
        return res.status(500).json({
             success: false,
             message: 'Internal Server Error'
        })
    }
}

