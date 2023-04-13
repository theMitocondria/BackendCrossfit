import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type:"String",
        required:true,
    },
    description:{
        type:"String",
        required:true,
    },
    image:{
        type:"String",
        required:true,
    },
    price:{
        type:"Number",
        required:true,
    },
    category:{
        type:"String",
        required:true,
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            },
            rating:{
                type:"Number",
                min:1,
                max:5,
                required:true,
            },
            review:{
                type:"String"
            },
        },
    ]
})

export default mongoose.model("Product", productSchema)
