import mongoose from "mongoose";

const PostSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    imageUrl:{
        type:"String",
        required:true,
    },
    captionHeading:{
        type:"String",
        required:true,
    },
    captionDescription:{
        type:"String",
        required:true,
    },
    likes:[
        {
           type:mongoose.Schema.Types.ObjectId,
           ref:"User",
        },
    ],
    comments:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
            },
            comment:{
                type:"String",
                required:true,
            }

         },
    ]
},
 {
    timestamps:true,
 })

export default mongoose.model('Post',PostSchema)