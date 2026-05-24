
const nodemailer = require('nodemailer');

const transportOptions = {
  service: 'gmail',
};

const emailPass = process.env.EMAIL_PASS || process.env.NODEMAILER_PASS;
if (emailPass) {
  transportOptions.auth = {
    user: process.env.EMAIL_USER,
    pass: emailPass
  };
} else {
  transportOptions.auth = {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
    accessToken: process.env.ACCESS_TOKEN
  };
}

const transporter = nodemailer.createTransport(transportOptions);


transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});


const sendEmail = async (email, name) => {
    try {
      const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to Onkart</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAFAFA; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1A1A1C; -webkit-font-smoothing: antialiased;">
  <div style="width: 100%; background-color: #FAFAFA; padding: 40px 0;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #FFFFFF; border: 1px solid #EAEAEA; border-radius: 4px; border-top: 4px solid #C64F38; box-shadow: 0 4px 30px rgba(0,0,0,0.01); overflow: hidden;">
      <!-- Logo Header -->
      <tr>
        <td style="padding: 40px 40px 20px 40px; text-align: center;">
          <a href="http://localhost:5173" style="display: inline-block; font-family: 'Space Grotesk', 'Inter', Arial, sans-serif; font-size: 26px; font-weight: 800; letter-spacing: 0.15em; color: #242426; text-decoration: none; text-transform: uppercase;">ONKART</a>
        </td>
      </tr>
      
      <!-- Content Body -->
      <tr>
        <td style="padding: 20px 40px 40px 40px;">
          <h1 style="font-family: 'Newsreader', 'Georgia', serif; font-size: 28px; font-weight: 500; line-height: 1.25; color: #1A1A1C; margin-top: 0; margin-bottom: 16px;">
            Welcome to the Curated Collection, ${name}.
          </h1>
          <p style="font-size: 15px; line-height: 1.6; color: #5C5C60; margin-top: 0; margin-bottom: 24px;">
            We are thrilled to welcome you to <strong>Onkart</strong>. Our mission is to elevate your daily shopping experience with a beautifully curated collection of high-quality products and state-of-the-art AI-driven recommendations.
          </p>
          
          <!-- Welcome Offer Box -->
          <div style="background-color: #F5F5F5; border-left: 3px solid #242426; padding: 20px; margin-bottom: 30px; border-radius: 0 4px 4px 0;">
            <h3 style="font-family: 'Space Grotesk', 'Inter', Arial, sans-serif; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #242426; margin-top: 0; margin-bottom: 8px;">
              Exclusive Welcome Offer
            </h3>
            <p style="font-size: 14px; line-height: 1.6; color: #5C5C60; margin: 0;">
              As a new member of our community, enjoy <strong>10% off</strong> your first order. Use your personalized account to explore handpicked daily items, premium electronics, and wellness products tailored precisely to your tastes.
            </p>
          </div>
          
          <!-- Call to Action -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:5173" style="display: inline-block; background-color: #242426; color: #FFFFFF; font-family: 'Space Grotesk', 'Inter', Arial, sans-serif; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; padding: 15px 30px; text-decoration: none; border-radius: 4px;">
              Explore the Collection
            </a>
          </div>
          
          <p style="font-size: 15px; line-height: 1.6; color: #5C5C60; margin: 0;">
            If you need any assistance or have feedback on our catalog, feel free to reply to this email or speak directly with our AI Shopping Buddy in the app.
          </p>
        </td>
      </tr>
      
      <!-- Footer -->
      <tr>
        <td style="background-color: #FAFAFA; border-top: 1px solid #EAEAEA; padding: 30px 40px; text-align: center;">
          <p style="font-size: 12px; line-height: 1.5; color: #8E8E93; margin: 0 0 12px 0;">
            © 2026 Onkart. Designed with absolute precision and premium aesthetics.
          </p>
          <p style="font-size: 12px; line-height: 1.5; color: #8E8E93; margin: 0;">
            You received this email because you registered an account on Onkart.
          </p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
`;

      const info = await transporter.sendMail({
        from: `"Onkart" <${process.env.EMAIL_USER}>`, 
        to: `${email}`,
        subject: "Welcome to Onkart",
        text: `Welcome ${name} to Onkart! We are wishing you future growth. Get 10% off your first order by exploring the collection at http://localhost:5173`,
        html: emailHtml
      });
  
      console.log('Message sent: %s', info.messageId);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };
  
  module.exports = sendEmail;