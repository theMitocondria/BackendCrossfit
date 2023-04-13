import Testimonial from "../models/testimonial.js";
import User from "../models/user.js";

export const newTest=async(req,res)=>{
    try {
        const {captionDescription,rating}=req.body;
        const {token}=req.headers;
        const user=await User.findOne({token});

        if(!user){
            return res.status(401).json({
                message:"Please login first ",
                success:false,
            })
        }
        if(!captionDescription){
            return res.status(404).json({
                message:"Please tell the description",
                success:false,
            })
        }

        const testimonial=await Testimonial.create({
            captionDescription,
            user:user._id,
            rating
        });

        return res.status(200).json({
            message:"Made Successfully",
            success:true,
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}



export const allTest=async(req,res)=>{
    try {
        const test=await Testimonial.find().populate("user");

        return res.status(200).json({
            message:"Made Successfully",
            success:true,
            test,
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}