import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name:{
        type:"String",
        required:true,
    },
    image:{
        type:"String",
        required:true,
    }, 
    products:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product",
            required:true,
        }
    ]
})

export default mongoose.model("Category", categorySchema)
