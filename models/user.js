import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
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
    isAdmin:{
        type:"Boolean",
        default:false,
    },
    token:{
        type:"String"
    },
    resetPasswordToken:{
        type:"String",
    },
    resetPasswordTokenExpire:{
        type:"Date",
        default: new Date()
    },
    avatar:{
        type:"String",
        default:"https://cdn-icons-png.flaticon.com/512/709/709722.png"
    },
    posts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Post",
        },
       
    ],
    orders:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Order",
        }
    ],

    hasShippingAddress: {
        type: Boolean,
        default: false,
      },

      shippingAddress: {
        name: {
          type: String,
        },
       
        city: {
          type: String,
        },
        pincode: {
          type: String,
        },
        state: {
          type: String,
        },
        country: {
          type: String,
        },
        phone: {
          type: String,
        },
      },

},
{
    timestamps:true,
})

userSchema.pre('save', async function(next){
    
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,10)
    }
    next(); 

})

userSchema.method('matchPassword', async function(givenPassword) {
    return  bcrypt.compare(givenPassword, this?.password);
})


export default mongoose.model("User", userSchema);