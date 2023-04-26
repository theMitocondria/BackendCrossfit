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
    captionHeading:{
        type:"String",
        required:true,
    },
},
 {
    timestamps:true,
 })

export default mongoose.model('Testimonial',TestimonialSchema);