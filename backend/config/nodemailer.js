const Brevo = require('@getbrevo/brevo');

// 1. Initialize Brevo Client
const apiInstance = new Brevo.TransactionalEmailsApi();
const apiKey = apiInstance.authentications['apiKey'];

// Use the API Key from Render Environment Variables
if (!process.env.BREVO_API_KEY) {
  console.error('❌ BREVO_API_KEY is missing in Environment Variables');
}
apiKey.apiKey = process.env.BREVO_API_KEY;

/**
 * Send email using Brevo API (HTTP)
 * Replacing the old Nodemailer transporter
 */
async function sendEmail(to, subject, html) {
  const sendSmtpEmail = new Brevo.SendSmtpEmail();

  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = html;
  
  // Must match the Verified Sender in your Brevo Dashboard
  sendSmtpEmail.sender = { 
    "name": "Fasika Admin", 
    "email": process.env.EMAIL_FROM 
  };
  
  sendSmtpEmail.to = [{ "email": to }];

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    // Note: Brevo SDK returns the response in data.body or just data depending on version
    console.log(`✅ Email sent to ${to}. ID: ${data.body?.messageId || 'Success'}`);
    return data;
  } catch (err) {
    // Detailed error logging to fix the 500 error
    console.error('🔥 Brevo API Error:', err.response ? err.response.body : err.message);
    throw err;
  }
}

module.exports = { sendEmail };
