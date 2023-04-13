import Categories from "../models/categories.js";

export const createCategory = async(req, res) => {
    try{
        const {name} = req.body;
        const image = req.file.path;

        if(!name || !image){
            return res.status(400).json({
                success:false,
                message:"please provide all the above fields."
            })
        }
        const category = await Categories.create({
            name:name.toLowerCase(),
            image
        })

        return res.status(200).json({
            success:true,
            category,
        })
        
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}



export const deleteCategory = async(req, res) => {
    try{
        let category =await Categories.findById(req.params.id);
         
        if(!category){
            return res.status(200).json({
                success:false,
                message:"Not found category"
            })
        }

        await Categories.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            success:true,
            message:"Category deleted successfully"
        })
        
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}



export const allCategory = async(req, res) => {
    try{
        let category =await Categories.find();

        return res.status(200).json({
            success:true,
            message:"Category all",
            category,
        })
        
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const particularCategoryProduct=async(req,res)=>{
    try{
        let category =await Categories.findById(req.params.id).populate("products");
        
        if(!category){
            return res.status(401).json({
                success:true,
                message:"Category not found",
            })
        }
        return res.status(200).json({
            success:true,
            message:"Category all product",
            category,
        })
        
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}