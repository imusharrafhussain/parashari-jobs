import nodemailer from 'nodemailer'
import logger from '../utils/logger.js'

// Singleton transporter instance
let transporter = null

/**
 * Initialize the email transporter (Singleton Pattern)
 */
const initTransporter = () => {
  if (transporter) return transporter

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    throw new Error('FATAL: EMAIL_USER and EMAIL_PASSWORD must be set in environment variables.')
  }

  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use STARTTLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    connectionTimeout: 10000, // 10 seconds timeout
    socketTimeout: 10000 // 10 seconds timeout
  })

  return transporter
}

/**
 * Verify SMTP connection on server startup
 * Should be called once when server starts
 */
export const verifyEmailConnection = async () => {
  try {
    const transport = initTransporter()
    await transport.verify()
    logger.info('✅ SMTP Connection Verified Successfully')
    return true
  } catch (error) {
    logger.error('❌ FATAL: SMTP Connection Failed', error)
    throw error // Throw to stop server startup if needed
  }
}

/**
 * Send an email (Generic)
 * @param {Object} mailOptions - Nodemailer mail options
 * @returns {Promise<Object>} - Nodemailer info object
 * @throws {Error} - If sending fails
 */
const sendMail = async (mailOptions) => {
  const transport = initTransporter()
  try {
    const info = await transport.sendMail(mailOptions)
    logger.info(`📧 Email sent: ${info.messageId}`)
    return info
  } catch (error) {
    logger.error('❌ Email Sending Failed:', error)
    throw error // Propagate error to caller
  }
}

/**
 * Send OTP Email
 * @param {string} email - Recipient email
 * @param {string} otp - OTP code
 */
export const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `"AstroBharatAI Careers" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your AstroBharatAI Application OTP',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #1a1f3a, #2d3561); padding: 30px; text-align: center; }
          .header h1 { color: #FFD700; margin: 0; font-size: 24px; }
          .content { padding: 40px 30px; }
          .otp-box { background: linear-gradient(135deg, #FFD700, #FFC700); padding: 20px; text-align: center; border-radius: 8px; margin: 30px 0; }
          .otp-code { font-size: 36px; font-weight: bold; color: #1a1f3a; letter-spacing: 8px; }
          .footer { background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✨ AstroBharatAI ✨</h1>
            <p style="color: #FFD700; margin: 10px 0 0 0; font-style: italic;">Stars Align Destiny Divine</p>
          </div>
          <div class="content">
            <h2>Verify Your Email Address</h2>
            <p>Thank you for applying to join our team! Please use the following OTP to verify your email address:</p>
            <div class="otp-box"><div class="otp-code">${otp}</div></div>
            <p><strong>This OTP is valid for 10 minutes.</strong></p>
            <p>If you didn't request this OTP, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} AstroBharatAI. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  return await sendMail(mailOptions)
}

/**
 * Send HR Notification
 * @param {Object} candidateData - Candidate details
 * @param {Buffer} resumeBuffer - Resume file buffer
 */
export const sendHRNotification = async (candidateData, resumeBuffer) => {
  if (!process.env.HR_EMAIL) {
    throw new Error('HR_EMAIL is not defined in environment variables')
  }

  const mailOptions = {
    from: `"AstroBharatAI Recruitment System" <${process.env.EMAIL_USER}>`,
    to: process.env.HR_EMAIL,
    subject: `New Qualified Candidate - ${candidateData.fullName} ${candidateData.atsStatus === 'SKIPPED' ? '(ATS Skipped)' : `(ATS Score: ${candidateData.atsScore})`}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
          .container { max-width: 700px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #1a1f3a, #2d3561); padding: 30px; text-align: center; }
          .header h1 { color: #FFD700; margin: 0; font-size: 24px; }
          .score-badge { display: inline-block; background: linear-gradient(135deg, #FFD700, #FFC700); color: #1a1f3a; padding: 10px 20px; border-radius: 25px; font-size: 24px; font-weight: bold; margin: 20px 0; }
          .content { padding: 40px 30px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e0e0e0; }
          th { background-color: #f9f9f9; font-weight: bold; color: #1a1f3a; }
          .footer { background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌟 New Qualified Candidate 🌟</h1>
            <div class="score-badge">
              ${candidateData.atsStatus === 'SKIPPED' ? 'ATS Skipped' : `ATS Score: ${candidateData.atsScore}/100`}
            </div>
          </div>
          <div class="content">
            <h2>Candidate Details</h2>
            <table>
              <tr><th>Full Name</th><td>${candidateData.fullName}</td></tr>
              <tr><th>Email</th><td><a href="mailto:${candidateData.email}">${candidateData.email}</a></td></tr>
              <tr><th>Phone</th><td>${candidateData.phone}</td></tr>
              <tr><th>Location</th><td>${candidateData.city}, ${candidateData.state}</td></tr>
              ${candidateData.linkedin ? `<tr><th>LinkedIn</th><td><a href="${candidateData.linkedin}" target="_blank">${candidateData.linkedin}</a></td></tr>` : ''}
              <tr><th>College/University</th><td>${candidateData.collegeName}</td></tr>
              <tr><th>Job Category</th><td>${candidateData.jobCategory}${candidateData.jobCategory === 'Custom' && candidateData.customJobRole ? ` - ${candidateData.customJobRole}` : ''}</td></tr>
              ${candidateData.currentCompany ? `<tr><th>Current Company</th><td>${candidateData.currentCompany}</td></tr>` : ''}
              <tr><th>Application Date</th><td>${new Date(candidateData.createdAt).toLocaleString()}</td></tr>
            </table>
            <h3>Parsed Resume Data</h3>
            <table>
              <tr><th>Skills</th><td>${candidateData.parsedData.skills.join(', ') || 'N/A'}</td></tr>
              <tr><th>Experience</th><td>${candidateData.parsedData.experience || 'N/A'}</td></tr>
              <tr><th>Education</th><td>${candidateData.parsedData.education || 'N/A'}</td></tr>
            </table>
            <p><strong>Note:</strong> The candidate's resume is attached to this email.</p>
          </div>
          <div class="footer">
            <p>This is an automated notification from the AstroBharatAI Recruitment System.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    attachments: [
      {
        filename: candidateData.resumeFileName,
        content: resumeBuffer
      }
    ]
  }

  return await sendMail(mailOptions)
}
