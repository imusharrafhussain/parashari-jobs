# Deployment Guide

This guide explains how to deploy the AstroBharatAI Recruitment Platform.

- **Frontend**: Vercel
- **Backend**: Render

---

## 🚀 1. Deploy Backend (Render)

1.  **Sign Up / Log In** to [Render](https://render.com).
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub repository: `parashari-jobs`.
4.  **Configure Service**:
    -   **Name**: `parashari-jobs-backend` (or similar)
    -   **Root Directory**: `server`
    -   **Runtime**: `Node`
    -   **Build Command**: `npm install`
    -   **Start Command**: `npm start`
    -   **Instance Type**: Free (or paid for better performance)
5.  **Environment Variables**:
    Add the following in the "Environment" tab:
    ```
    PORT=5000
    MONGODB_URI=<your_mongodb_connection_string>
    EMAIL_SERVICE=gmail
    EMAIL_USER=<your_gmail_address>
    EMAIL_PASSWORD=<your_gmail_app_password>
    HR_EMAIL=<hr_email_address>
    FRONTEND_URL=https://<your-frontend-app>.vercel.app
    JWT_SECRET=<your_jwt_secret>
    ADMIN_USERNAME=admin
    ADMIN_PASSWORD_HASH=<your_bcrypt_hash_or_use_default_for_admin>
    ```
6.  Click **Create Web Service**.
7.  **Copy the Backend URL** (e.g., `https://parashari-jobs-backend.onrender.com`). You will need this for the frontend Config.

---

## 🌐 2. Deploy Frontend (Vercel)

1.  **Sign Up / Log In** to [Vercel](https://vercel.com).
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository: `parashari-jobs`.
4.  **Configure Project**:
    -   **Framework Preset**: Vite
    -   **Root Directory**: `./` (leave empty or default)
    -   **Build Command**: `npm run build`
    -   **Output Directory**: `dist`
5.  **Environment Variables**:
    Add the following:
    ```
    VITE_API_URL=<your_render_backend_url>
    ```
    *(Example: `https://parashari-jobs-backend.onrender.com`)*
6.  Click **Deploy**.

---

## ✅ 3. Final Verification

1.  Open your Vercel URL (e.g., `https://astrobharat-jobs.vercel.app`).
2.  Try to submit an application.
3.  If successful, the backend is correctly receiving requests from the frontend!

---

## ⚠️ Important Notes

-   **Render Free Tier**: The backend will "spin down" after 15 minutes of inactivity. The first request after inactivity may verify take 50+ seconds to respond.
-   **CORS**: Ensure `FRONTEND_URL` in backend env vars matches your Vercel domain exactly (no trailing slash).
