import User from "../models/user.js";

const isAdmin = async(req, res, next) => {
    const token = req.headers.token;
    const user =  await User.findOne({token});
    if(user?.isAdmin == true){
        next();
    }else{
       return res.status(401).json({
            success:false,
            message:"you are not admin",
        })
    }
}

export default isAdmin