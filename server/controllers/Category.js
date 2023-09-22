const Category = require('../models/Category');


exports.createCategory = async (req, res) => {
    try{
        const {name,description} = req.body;

        if(!name || !description){
            return res.status(400).json({
                success: false,
                message: 'Please provide name and description'
            })
        }

        const newCategory = await Category.create({
			name: name,
			description: description,
		});
        
        console.log(newCategory);

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
        })

    }catch(err){
        res.status(400).json({
            status: false,
            message: err.message
        })
    }
}

exports.showAllCategories = async (req, res) => {
    try{
        const allCategory = await Category.find({},
            {name:true,description:true}
        );

        res.status(200).json({
            success: true,
            message: 'All Tags',
            allCategory,
        })

    }catch(err){
        res.status(500).json({
            success: false,
            message: err
        })
    }
}

//categorypagedetails

exports.categoryPageDetails = async (req, res) => {
     try {
         const {categoryId} = req.body;

            const categoryDetails = await Category.findById(categoryId).populate('courses').exec();

            if(!categoryDetails){
                return res.status(400).json({
                    success: false,
                    message: 'Please provide a valid category id'
                })
            }

            const categoriesExceptSelected = await Category.find(
            {
                _id: { $ne: categoryId },
            }).populate("courses")
            .exec();

             
    
            const allCategories = await Category.find().populate("courses").exec();
            const allCourses = allCategories.flatMap((category) => category.courses);
            const mostSellingCourses = allCourses
                .sort((a, b) => b.sold - a.sold)
                .slice(0, 10);
    
            res.status(200).json({
                selectedCourses: selectedCourses,
                differentCourses: differentCourses,
                mostSellingCourses: mostSellingCourses,
            });

     } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
     }
}