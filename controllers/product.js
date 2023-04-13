import Categories from "../models/categories.js";
import Product from "../models/product.js";
import User from "../models/user.js";
export const createProduct=async (req,res)=>{
    try {
        const {category,price,description,name}=req.body;
        const image=req.file.path;
        
        
        const CategoryFOund=await Categories.findOne({name:category.toLowerCase()});
        const productFOund=await Product.findOne({name});

        if(!CategoryFOund){
            return res.status(402).json({
                message:"not a category",
                success:false,
            })
        }
        if(productFOund){
            return res.status(402).json({
                message:"already",
                success:false,
            })
        }

        const product = await Product.create({
            name, description, image, price, category
        });

        console.log(product);

        CategoryFOund.products.push(product._id);

        await CategoryFOund.save()

        
        return res.status(200).json({
            message:"product  created",
            success:true,
        })

    
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}



export const singleProduct=async (req,res)=>{
    try {
        const product = await Product.findById(req.params.id);
        if(!product){
            return res.status(401).json({
                message:"Wrong id",
                success:false,
            })
        }

        return res.status(200).json({

            message:"single",
            success:true,
            product
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


export const allProduct=async (req,res)=>{
    try {
        const product=await Product.find();
        return res.status(200).json({
            message:"all",
            success:true,
            product,
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


export const giveReview=async(req,res)=>{
    try {
        const{rating,review}=req.body;
        const user=await User.findOne({token:req.headers.token});

        if(!rating){
            return res.status(400).json({
                message:"Please tell the rating",
                success:false,
            })
        }
        
        const obj={
        user:user._id,
        rating,
        review,
        }

        const product=await Product.findById(req.params.id);
        product.reviews.push(obj);
        await product.save();

        return res.status(200).json({
            message:"Done succesffully",
            success:true,
            product,
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message,
            success:false,
        })
    }
   
}