import User from "../models/user.js";
import generateToken from "../middlewares/generateToken.js";
import { sendEmail } from "../middlewares/sendMail.js";
import jwt from 'jsonwebtoken';
import tempUser from "../models/tempUser.js";
import { sendResetPasswordEmail } from "../middlewares/sendResetPasswordMail.js";

export const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // checking email, password, name
        if (!email ||  !name  ||  !password) {
             res.status(400).json({
                message: "provide all the credentials",
                success: false,
            })
        }

        
        const emailfound = await User.findOne({email});
        if(emailfound){
            return res.status(401).json({
                message:"User already exists, please login"
            })
        }

        const tempEmailFound=await tempUser.find({email});
        if(tempEmailFound.length>0){
            await tempUser.deleteMany({email});
        }

        let otp = Math.ceil(Math.random() * 1000000);
         
        while(otp<100000){
            otp = Math.ceil(Math.random() * 1000000);
        }
        
        await sendEmail(email, "Email verify",otp, name );

        const user = await tempUser.create({
            name, email, password, otp,otpExpires:new Date(Date.now()+1000*60*10),
        });
        
        user.token=generateToken(user._id);
        await user.save();  

        return res.status(200).json({
            message: "User created in buffer",
            success: true,
            user,
            token:generateToken(user._id)
        })

    } catch (error) {

        return res.status(500).json({
            message: error.message,
            success: false,
        })
    }
}

export const registerOtpVerify=async(req,res)=>{
   try{
    const {otp}=req.body;
    const {token}=req.headers;

    const user=await tempUser.findOne({token});

    if(!user){
        return res.status(401).json({
            message:"Login or Rgister again",
            success:false,
        })
    }else{

    if(user.otp.toString() === otp.toString()  && user.otpExpires>=new Date()){
        user.otp=null;
        user.otpExpires=new Date();
       
        const NewUser=await User.create({
            name:user.name,
            email:user.email,
            password:user.password,
            token:user.token,
        })

        await tempUser.deleteMany({email:user.email});
        res.status(200).json({
            message:"working",
            user:NewUser,
        })
    }else if(user.otpExpires<new Date()){
        await tempUser.deleteMany({email:user.email});

        res.status(500).json({
            message:"Otp expired pls renter the credentils",
            success:false,
        })
    }else if(user.otp.toString() !== otp.toString()){
        res.status(500).json({
            message:"Re-enter the otp . the otp is wrong0",
            success:false,
        })
    }
}
   }catch(error){
    res.status(401).json({
        success: false,
        message: error.message,
    })
   }
    
}



export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // checking email, password
        if (!email || !password) {
            return res.status(400).json({
                message: "email or password cant be null",
                success: false,
            })
        }

        const user = await User.findOne({ email });
        if(!user){
            return res.status(401).json({
                message: "invalid email or password"
            })
        }
        const passwordCheck = await user.matchPassword(password);

        if (!passwordCheck) {
            return res.status(401).json({
                message: "invalid email or password"
            })
        }

        user.token=generateToken(user._id);
        await user.save();

        res.status(200).json({
            message: "login sucess",
            success: true,
            user,
            token: generateToken(user._id)
        })


    } catch (error) {

        res.status(500).json({
            message: error.message,
            success: false,
        })
    }
}



export const forgetPassword = async(req, res) => {
    try{
        const {email} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"Email not found",
            })
        }

        let random = Math.random()
        // console.log(random)
        const resetToken = jwt.sign(random,process.env.RESET_SECRET);
        console.log(resetToken)
        user.resetPasswordToken=resetToken;
        user.resetPasswordTokenExpire=Date.now()+1000*60*10;
        
        await user.save();
        const resetUrl=`https://crossfit-front.vercel.app/reset/password/`+resetToken;
        
       await sendResetPasswordEmail(user.name,email, resetUrl);
        return res.status(200).json({
            message:"link send successffuly",
            success:true,
            resetUrl
        })

    }catch (error) {

        res.status(500).json({
            message: error.message,
            success: false,
        })
    }
}

export const resetPassword = async(req, res) => {
    try{

        const {password,id}  = req.body;
        console.log(`this is token ${id}`);
        const user = await User.findOne({
            resetPasswordToken:id,
            resetPasswordTokenExpire: { $gt: Date.now() },
        })

        console.log(user);

        if(!user){
            return res.status(401).json({
                success:false,
                message:"token is not valid or expired"
            })
        }

        user.password = password;
        user.resetPasswordToken = null;
        user.resetPasswordTokenExpire = Date.now();
        await user.save();

        

        return res.status(200).json({
            success: true,
            message:"password updated succcessfully."
        })

    }catch (error) {

        res.status(500).json({
            message: error.message,
            success: false,
        })
    }
}

export const logout = async(req, res) => {
   try {
     const user=User.findOne({token:req.headers.token});
     user.token=null;
     await user.save();
     return res.status(200).json({
        message:"Logout",
        success:true,
    })
   } catch (error) {
    return res.status(500).json({
        message:error.message,
        success:false,
    })
   }  
}

export const getMyProfile = async(req, res) => {
    try{
        const {token} = req.headers;
        const user = await User.findOne({token}).populate("orders");
        if(!user){
           return res.status(401).json({
                success:false,
                message:"user not found",
            })
        }

        return res.status(200).json({
            success: true,
            user,
        })

    }catch(error){  
        return res.status(500).json({
                success:false,
                message:error.message
        })
    }
}



export const avatarUpload = async(req, res) => {
    try{
        
        const {token} = req.headers;
        const user =await User.findOne({token});
        console.log(req.file);

        const image = req.file.path;
        if(!image){
            return res.status(300).json({
                success:false,
                message:"please upload an image first."
            })
        }
        user.avatar = image;

        await user.save();

        return res.status(201).json({
            message:"avatar updated succesfully",
            success:true,
            user,
        })


    }catch(error){  
        return res.status(500).json({
                success:false,
                message:error.message
        })
    }
}

export const addShippingAddress = async(req, res) => {
    try{
        const {token} =req.headers;
        const user =await User.findOne({token});

        const {shippingAddress} = req.body;
        console.log(shippingAddress);
        if(!shippingAddress){
            res.status(500).json({
                success:false,
                message:"address not",
                user,
            })
    
        }
        user.shippingAddress = shippingAddress;
        user.hasShippingAddress = true;
        await user.save();


        res.status(200).json({
            success:true,
            message:"address updated succesfully",
            user,
        })

    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const allusers = async( req, res) => {
    try{
        const users = await User.find({});
        
        res.status(200).json({
            success:true,
            users
        })
    }catch(error){
        res.status(501).json({
            success:false,
            message:"chud gai"
        })
    }
}

export const singleuser = async( req, res) => {
    try{
        const {id} = req.body;
        
        const user = await User.findById(id).populate("posts");
        
        res.status(200).json({
            success:true,
            user
        })
    }catch(error){
        res.status(501).json({
            success:false,
            message:"chud gai"
        })
    }
}