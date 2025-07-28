const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendBillEmail = async (req, res) => {
  console.log("📩 Email request received");
  const { to, subject, htmlContent } = req.body;

  if (!to || !subject || !htmlContent) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: to, subject, or htmlContent'
    });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject,
      html: htmlContent,
    });

    if (error) {
      console.error("❌ Resend error:", error);
      return res.status(500).json({ success: false, error });
    }

    console.log("✅ Email sent:", data);
    return res.status(200).json({ success: true, data, message: 'Email sent!' });
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { sendBillEmail };