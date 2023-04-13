import mongoose from "mongoose";

const TestimonialSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    captionDescription:{
        type:"String",
        required:true,
    },
    rating:{
        type:"Number",
        min:1,
        max:5,
        required:true,
    }
},
 {
    timestamps:true,
 })

export default mongoose.model('Testimonial',TestimonialSchema);