# Deployment Guide: Vercel + Render

This guide walks you through deploying the Parashari Job Portal to production.

## Prerequisites

- [ ] GitHub account
- [ ] Vercel account (free tier)
- [ ] Render account (free tier)
- [ ] MongoDB Atlas account (free tier) OR existing MongoDB connection string
- [ ] Gmail credentials for sending emails

## Step 1: Set Up MongoDB (Choose One Option)

### Option A: MongoDB Atlas (Recommended)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free M0 cluster
3. Create a database user (username + password)
4. Whitelist all IPs: Network Access → Add IP Address → `0.0.0.0/0`
5. Get your connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/astrobharatai_recruitment
   ```

### Option B: Existing MongoDB
Use your existing MongoDB connection string.

## Step 2: Deploy Backend to Render

1. **Push to GitHub**
   ```bash
   cd a:\AstroBharatAI\Projects\mohit\parashari-job-portal
   git add .
   git commit -m "Add deployment configuration"
   git push origin main
   ```

2. **Create Render Web Service**
   - Go to https://render.com/
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `parashari-job-portal-backend`
     - **Root Directory**: `server`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Instance Type**: Free

3. **Add Environment Variables** (in Render dashboard)
   ```
   PORT=5000
   MONGODB_URI=<your-mongodb-connection-string>
   EMAIL_SERVICE=gmail
   EMAIL_USER=mohitdhanuka01@gmail.com
   EMAIL_PASSWORD=ljnhibpsfdxfegya
   HR_EMAIL=mohitdhanuka01@gmail.com
   FRONTEND_URL=https://your-app.vercel.app
   NODE_ENV=production
   ```

4. **Deploy**: Click "Create Web Service"
5. **Copy the URL**: e.g., `https://parashari-job-portal-backend.onrender.com`

## Step 3: Deploy Frontend to Vercel

1. **Update vercel.json**
   Edit `vercel.json` and replace `your-backend-url.onrender.com` with your actual Render URL.

2. **Deploy to Vercel**
   ```bash
   cd a:\AstroBharatAI\Projects\mohit\parashari-job-portal
   npm install -g vercel
   vercel login
   vercel
   ```

3. **Follow prompts**:
   - Set up and deploy? **Y**
   - Which scope? (select your account)
   - Link to existing project? **N**
   - Project name? `parashari-job-portal`
   - Directory? `./` (press Enter)
   - Override settings? **N**

4. **Add Environment Variable** (in Vercel dashboard)
   - Go to your project → Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-url.onrender.com`
   - Redeploy: Deployments tab → click ⋯ → "Redeploy"

## Step 4: Update Backend FRONTEND_URL

1. Go to Render dashboard → Your service → Environment
2. Update `FRONTEND_URL` to your Vercel URL: `https://your-app.vercel.app`
3. Save changes (service will auto-redeploy)

## Step 5: Test the Application

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Click "Apply Now"
3. Fill in the form with your email
4. Check email for OTP
5. Upload a resume
6. Submit and verify:
   - Check MongoDB Atlas for stored data
   - If ATS score ≥70, check HR email

## Troubleshooting

### Backend fails to start
- Check Render logs for errors
- Verify MongoDB connection string is correct
- Ensure all environment variables are set

### Frontend can't connect to backend
- Verify `VITE_API_URL` is set correctly in Vercel
- Check backend CORS allows your Vercel domain
- Check browser console for errors

### Emails not sending
- Verify Gmail credentials are correct
- Use App Password, not regular password
- Check Render logs for email errors

### Resume upload fails
- Check Render logs for file size limits
- Verify GridFS is working with MongoDB

## Important Notes

> [!WARNING]
> **Free Tier Limitations**
> - Render free tier: 15 min inactivity spin-down (first request may be slow)
> - MongoDB Atlas M0: 512MB storage limit
> - Vercel: Bandwidth and build minute limits

> [!IMPORTANT]
> **Security**
> - Never commit `.env` files to Git
> - Keep email credentials secure
> - Use strong MongoDB passwords
> - Consider adding rate limiting for production

## Production URLs

After deployment, you'll have:
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://parashari-job-portal-backend.onrender.com
- **API Health**: https://parashari-job-portal-backend.onrender.com/api/health
