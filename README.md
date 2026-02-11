# AstroBharatAI Recruitment Platform

A professional recruitment application for Astrobharatai featuring an eye-catching landing page, OTP-verified candidate registration, resume upload with ATS scanning, and automated email delivery for qualified candidates (70+ ATS score).

## Features

### Candidate-Facing
- **Cosmic-Themed Landing Page**: Showcases AstroBharatAI's mission and services
- **Multi-Step Application Form**: Personal info → OTP verification → Resume upload
- **Email Verification**: 6-digit OTP with 10-minute validity
- **Resume Upload**: Drag-and-drop PDF/DOCX files (max 5MB)
- **Duplicate Prevention**: One application per email address

### Backend Processing
- **ATS Resume Scanner**: Analyzes resumes and calculates scores (0-100)
- **Automated Email to HR**: Sends qualified candidate details (70+ score) with resume attached
- **GridFS Storage**: Efficient file storage in MongoDB
- **Resume Parsing**: Extracts skills, experience, education from PDFs

## Tech Stack

**Frontend:**
- React 18
- Vite
- React Router
- Axios
- React Toastify
- Custom CSS (Cosmic theme with navy blue + gold)

**Backend:**
- Node.js
- Express
- MongoDB (with GridFS)
- Multer (file uploads)
- Nodemailer (emails)
- pdf-parse & mammoth (resume parsing)
- bcryptjs (OTP hashing)

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or remote connection)
- Gmail account for sending emails (or other SMTP service)

### 1. Clone the Repository
```bash
cd "d:/resume checker"
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd server
npm install
cd ..
```

### 4. Configure Environment Variables

Create `server/.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/astrobharatai_recruitment
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
HR_EMAIL=mohitdhanuka01@gmail.com
FRONTEND_URL=http://localhost:5173
```

**Important**: For Gmail, you need to use an [App Password](https://support.google.com/accounts/answer/185833?hl=en), not your regular password.

### 5. Start MongoDB
Make sure MongoDB is running:
```bash
# If using local MongoDB
mongod
```

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd server
npm start
```
Server will run on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Frontend will run on http://localhost:5173

### Access the Application
Open your browser and navigate to: http://localhost:5173

## Usage

### For Candidates

1. **Visit Landing Page**: Browse company information and services
2. **Click "Apply Now"**: Start the application process
3. **Fill Personal Info**: Enter name, email, phone, city, state, etc.
4. **Verify Email**: Receive and enter 6-digit OTP
5. **Upload Resume**: Drag-and-drop PDF or DOCX file
6. **Submit**: Application is processed with ATS scoring

### For HR Team

- **Qualified Candidates (70+ ATS Score)**: Automatically receive email with:
  - Candidate details
  - ATS score
  - Parsed resume data
  - Resume file attached
- **All Applications**: Stored in MongoDB for manual review

## ATS Scoring Criteria

The system evaluates resumes based on:

1. **Contact Information (10 points)**
   - Email found: +5
   - Phone found: +5

2. **Skills Match (30 points)**
   - Matches keywords for tech, business, and spiritual skills
   - Each matched skill: +3 points (max 30)

3. **Experience (25 points)**
   - 5+ years: 25 points
   - 3-5 years: 20 points
   - 1-3 years: 15 points
   - 0-1 years: 10 points

4. **Education (20 points)**
   - PhD/Doctorate: 20 points
   - Master's: 18 points
   - Bachelor's: 15 points
   - Diploma: 12 points

5. **Resume Completeness (15 points)**
   - Word count (300-2000 words): +5
   - Common sections present: +10

**Total: 100 points**
**Threshold for HR notification: 70+ points**

## Project Structure

```
d:/resume checker/
├── public/                 # Static files
├── src/
│   ├── components/         # React components
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── pages/             # Page components
│   │   ├── LandingPage.jsx
│   │   ├── ApplicationPage.jsx
│   │   └── SuccessPage.jsx
│   ├── utils/
│   │   └── api.js         # API client
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── server/
│   ├── config/
│   │   └── database.js    # MongoDB connection
│   ├── middleware/
│   │   └── upload.js      # Multer config
│   ├── routes/
│   │   ├── otp.js         # OTP endpoints
│   │   ├── candidates.js  # Candidate endpoints
│   │   └── applications.js # Application submission
│   ├── services/
│   │   ├── emailService.js    # Email templates
│   │   ├── resumeParser.js    # PDF/DOCX parsing
│   │   └── atsScoring.js      # ATS algorithm
│   ├── .env.example       # Environment template
│   └── server.js          # Express server
├── package.json
└── README.md
```

## API Endpoints

### OTP Routes
- `POST /api/otp/send` - Send OTP to email
- `POST /api/otp/verify` - Verify OTP code

### Candidate Routes
- `POST /api/candidates/check-duplicate` - Check if email exists

### Application Routes
- `POST /api/applications/submit` - Submit application with resume

### Health Check
- `GET /api/health` - Server status

## Troubleshooting

### Email Not Sending
- Verify `EMAIL_USER` and `EMAIL_PASSWORD` in `.env`
- For Gmail, use App Password (not regular password)
- Check if less secure apps is enabled (if not using App Password)

### MongoDB Connection Failed
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify network connectivity

### Resume Parsing Errors
- Ensure file is PDF or DOCX
- Check file size is under 5MB
- Test with well-formatted resumes

### OTP Not Received
- Check spam folder
- Verify email service configuration
- Check server logs for email errors

## Future Enhancements

- Admin dashboard for manual resume review
- Bulk export of applications
- Advanced search and filtering
- Interview scheduling integration
- WhatsApp notifications
- Multi-language support

## License

Proprietary - AstroBharatAI

## Support

For issues or questions, contact: mohitdhanuka01@gmail.com

---

**Built with ❤️ for AstroBharatAI**
*Stars Align Destiny Divine* ✨
