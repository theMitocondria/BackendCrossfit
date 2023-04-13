import mongoose from "mongoose";

const randomTxt = Math.random().toString(36).substring(7).toUpperCase();
const randomNumbers = Math.floor(1000 + Math.random() * 90000);

const orderSchema = new mongoose.Schema({
    orderedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    orderItems:[
        {
            type:Object,
            required:true,
        },
    ],
    shippingAddress:{
        type:Object,
        required:true,
    },
    paymentStatus:{
        type:"String",
        default:"false",
    },
    amount:{
        type:"Number",
        default:0
    },
    status:{
        type:"String",
        default:"Pending",
        enum:["Pending","In Transit", "Completed"]
    },
    orderNumber:{
        type:String,
        default:randomTxt+randomNumbers,
    },

},{
    timeStamps:true,
})


export default mongoose.model('Order', orderSchema);