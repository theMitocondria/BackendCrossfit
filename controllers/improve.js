import { sendEmailimprove } from "../middlewares/sendReviewMail.js";
import User from "../models/user.js";

export const improvementPost=async(req,res)=>{
    try {
        const des=req.body.description;
        const {token}=req.headers;

        const user=await User.findOne({token});
        if(!token){
            return res.status(401).json({
                message:"Please login",
                success:false,
            })
        }
        if(!des){
            return res.status(401).json({
                message:"Please tell the description",
                success:false,
            })
        }

        await sendEmailimprove(process.env.EMAIL_USERNAME,"IMPROVE OR REVIEW",des,user.name);
        return res.status(200).json({
            message:"Thanks for your review",
            success:true,
        })
        
    } catch (error) {
        return res.status(500).json({
            message:error.message,
            success:false,
        })
    }
}