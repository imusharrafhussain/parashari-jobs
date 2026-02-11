# MongoDB Setup for Windows

## Option 1: Download and Install MongoDB Community Server (Recommended)

### 1. Download MongoDB
- Go to: https://www.mongodb.com/try/download/community
- Select: Windows
- Version: Latest (7.x or 6.x)
- Package: MSI installer
- Click **Download**

### 2. Install MongoDB
- Run the downloaded `.msi` file
- Choose "Complete" installation
- **Important**: Check the box "Install MongoDB as a Service"
- **Important**: Check "Install MongoDB Compass" (GUI tool)
- Click Install

### 3. Add MongoDB to PATH (if not automatic)
Add this to your System Environment Variables PATH:
```
C:\Program Files\MongoDB\Server\7.0\bin
```

### 4. Start MongoDB
MongoDB should start automatically as a Windows service.

To verify:
```powershell
mongod --version
```

## Option 2: Use MongoDB Compass Without Installing Server

If you just want to test quickly:

### 1. Download MongoDB Compass Only
- Go to: https://www.mongodb.com/try/download/compass
- Download and install Compass

### 2. Use MongoDB Atlas (Cloud - Free)
- Go to: https://www.mongodb.com/cloud/atlas/register
- Create free account
- Create free cluster (M0)
- Get connection string
- Update `server/.env`:
  ```
  MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/astrobharatai_recruitment
  ```

## Quick Test Connection

Once MongoDB is running, open MongoDB Compass:
- Connection string: `mongodb://localhost:27017`
- Click **Connect**
- You should see the connection successful

After running the application once, you'll see the `astrobharatai_recruitment` database appear!
