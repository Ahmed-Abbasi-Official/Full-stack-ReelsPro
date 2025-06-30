import nodemailer from 'nodemailer'



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
    text: "Hello world?", // plain‑text body
    html: code, // HTML body
  });

  if(info)  
  {
    return true
  }else{
    return false
  }
};

