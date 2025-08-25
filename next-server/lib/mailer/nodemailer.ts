import nodemailer from 'nodemailer'
import { Verification_Email_Template } from './emailTemplate';



export  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.OWNER_EMAIL, // your Gmail address
      pass: process.env.OWNER_EMAIL_SECRET, // your Gmail app password
    },
  });

export const sendVerificationCode=async (email:string,code:string) => {
  const info = await transporter.sendMail({
    from: 'Reels Pro',
    to: email,
    subject: "Hello ✔",
    text: "Hello world?",
    html: Verification_Email_Template.replace("{verificationCode}",code), 
  });

  if(info)  
  {
    return true
  }else{
    return false
  }
};

