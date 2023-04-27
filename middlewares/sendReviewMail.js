import nodemailer from "nodemailer";

export const sendEmailimprove = async (
  receiverEmail,
  heading,
  message,
  name = "USER"
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
    to: receiverEmail, // List of recipients
    subject: heading, // Subject line
    html: ` <div
    style="border:0.5px solid ;  border-radius: 12px; 
    background-color: rgb(0, 0, 0); align-items:center; padding: 10px;">
    <img style="height:60px; " src="https://res.cloudinary.com/dycitvrpg/image/upload/c_pad,b_auto:predominant,fl_preserve_transparency/v1681382796/logo_xx6npu.jpg" alt="Crossfit">
    <hr>
    <br>
    <p style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; color:rgb(235, 235, 235)">Dear ${name.toUpperCase()}</p>
    <p style="font-size: 13px; font-family: Arial, Helvetica, sans-serif; color:rgb(235, 235, 235)">As part of our commitment to ensuring the security of your account with CrossFit, we are sending you a
        One-Time Password: </p>

    <h2 style="font-family: Arial, Helvetica, sans-serif; color:rgb(235, 235, 235)">${message}</h2>
    <p style="font-size: 13px; font-family: Arial, Helvetica, sans-serif; color:rgb(235, 235, 235)">            
        to confirm your identity. This OTP is required for you to access certain features
        and functionalities of our app. </p>

    <p style=" font-size: 13px;font-family: Arial, Helvetica, sans-serif; color:rgb(235, 235, 235)" >Best regards,</p>
    <p style="font-size: 13px; font-family: Arial, Helvetica, sans-serif; color:rgb(235, 235, 235)">The CrossFit Team</p>

</div>`,
  };

  transport.sendMail(mailOptions);
};
