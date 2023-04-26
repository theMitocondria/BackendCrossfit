import { sendFeedbackEmail } from "../middlewares/sendFeedbackEmail.js";
import User from "../models/user.js";

export const feedback = async(req, res) => {
    try{

        const {name, email, number, feedback} = req.body;
        console.log({name, email, number, feedback});
        const {token} = req.headers;
        const user = await User.findOne({token});

        await sendFeedbackEmail(name, email, number, feedback, user);

        return res.status(200).json({
            success:true,
            message: "Your feedback was sent successfully, Thanks."
        })


    }catch(e){
        res.status(500).json({
            success: false,
            message: e.message,
        })
    }
}