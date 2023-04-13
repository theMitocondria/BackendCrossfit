import mongoose from "mongoose";

const tempSchema = new mongoose.Schema({
    name:{
        type:"String",
        required:true,
    },
    email:{
        type:"String",
        required:true,
    },
    password:{
        type:"String",
        required:true,
        min:[6, "password must be atleat 6 characters long."]
    },
    otp:{
        type:"Number",
        default:null,
    },
    otpExpires:{
        type:"Date",
        default:new Date()
    },
    token:{
        type:"String"
    },
})

export default mongoose.model("Temp", tempSchema);