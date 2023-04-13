import { Configuration, OpenAIApi } from 'openai';

export const chatService = async(req, res) => {
    try{

        const sendmessage = req.body.message;
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
        
          res.status(200).json({
            success: true,
            message: incommingMessage,
          })
    }catch(error){
       res.status(500).json({
        success: false,
        message: error.message,
       })
    }
}

