import { Configuration, OpenAIApi } from 'openai';
import cloudinary from 'cloudinary'
import text2image from 'text-to-image'
import path from 'path';
import fs from 'fs';
// import __dirname from 'path';
const __dirname = path.resolve()


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API,
    api_secret: process.env.CLOUD_API_SECRET
});

export const plan = async(req, res) => {
    try{
        
        const sendmessage = req.body.message.trim();
        if(!sendmessage){
            res.status(400).json({
                success: false,
                message: 'Invalid message'
            })
        }
       
        const config = new Configuration({
            apiKey: process.env.CHATGPT_API_TOKEN
        });

        const openai = new OpenAIApi(config);

        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: sendmessage }],
          })

          const incommingMessage = response.data.choices[0].message.content;

          const photoName = Date.now()+".png";
          
          let dataUri = await text2image.generate(incommingMessage, {
            debug: true,
            // width: 720,
            // height: 1000,
            fontSize: 24,
            fontFamily:"Arial",
            lineHeight:20,
            margin: 10,
            bgColor: "white",
            textColor: "black",
            debugFilename:path.join("public",photoName)
        })

        const myCloud = await cloudinary.v2.uploader.upload(path.join(__dirname,"public",photoName), {
            folder: "Plans",
        });
        
        
        //delete the file now
        fs.unlink(__dirname+"/public/"+photoName,(err)=>{
            if(err){
                console.log(err);
            }
            else{
                console.log("deleted")
            }
        })

        

          res.status(200).json({
            success: true,
            image: myCloud.secure_url,
          })
    }catch(error){
       res.status(500).json({
        success: false,
        message: error.message,
       })
    }
}

