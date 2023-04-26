import nodemailer from "nodemailer";

export const sendFeedbackEmail = async (
    name,
    email, 
    number,
    feedback,
    user,
) => {
  let transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USERNAME, // Sender address
    to: process.env.EMAIL_USERNAME, // List of recipients
    subject: "Feedback from User", // Subject line
    html: ` <div
    style="border:0.5px solid ;  border-radius: 12px; 
    background-color: rgb(0, 0, 0); ; align-items:center; padding: 10px;">

    <img style="height:60px; "
        src="https://res.cloudinary.com/dycitvrpg/image/upload/c_pad,b_auto:predominant,fl_preserve_transparency/v1681382796/logo_xx6npu.jpg"
        alt="Crossfit">
    <hr>
    <br>
    <p style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; color:rgb(235, 235, 235)"> ${name}</p>
    <p style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; color:rgb(235, 235, 235)"> ${email}</p>
    <p style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; color:rgb(235, 235, 235)"> ${number}</p>
    <p style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; color:rgb(235, 235, 235)"> ${feedback}</p>
        
        ${user.email}

    </p>

  
    <p style=" font-size: 13px;font-family: Arial, Helvetica, sans-serif; color:rgb(235, 235, 235)">Best regards,
    </p>
    <p style="font-size: 13px; font-family: Arial, Helvetica, sans-serif; color:rgb(235, 235, 235)">The CrossFit
        Team</p>

</div>`  };

  transport.sendMail(mailOptions);
};
