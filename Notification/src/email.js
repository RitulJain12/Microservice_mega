
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (email, name) => {
    try {
      const info = await transporter.sendMail({
        from: `"Online-Market" <${process.env.EMAIL_USER}>`, // sender address
        to:`${email}`,
        subject:"Online-Market",
        text:`Welocome ${name} to NeatCode We are Wishing For your Future Growth `,
        //html:"<b>This is Test Email<b>"
        
      });
  
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };
  
  module.exports = sendEmail;