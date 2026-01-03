# MongoDB Setup Guide

## Option 1: MongoDB Atlas (Recommended - Free & Easy)

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Sign up for free

2. **Create Cluster**
   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Select a region close to you
   - Click "Create"

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose authentication method: Password
   - Create username and password (save these!)
   - Set user privileges: "Atlas admin"

4. **Whitelist IP Address**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Confirm

5. **Get Connection String**
   - Go back to "Databases"
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`

6. **Update Backend .env File**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/employee_management
   ```
   Replace `username` and `password` with your credentials

7. **Test Connection**
   ```bash
   cd backend
   npm run seed
   ```

## Option 2: Local MongoDB Installation (Windows)

1. **Download MongoDB**
   - Go to https://www.mongodb.com/try/download/community
   - Download MongoDB Community Server
   - Choose Windows x64 MSI

2. **Install MongoDB**
   - Run the installer
   - Choose "Complete" installation
   - Install as a Windows Service (recommended)
   - Install MongoDB Compass (GUI tool)

3. **Create Data Directory**
   ```bash
   mkdir C:\data\db
   ```

4. **Start MongoDB Service**
   ```bash
   # If installed as service, it should auto-start
   # Or manually start:
   net start MongoDB
   ```

5. **Verify Installation**
   ```bash
   # Open MongoDB Compass
   # Connect to: mongodb://localhost:27017
   ```

6. **Backend is Already Configured**
   - `.env` file uses: `mongodb://localhost:27017/employee_management`
   - No changes needed!

7. **Seed Database**
   ```bash
   cd backend
   npm run seed
   ```

## Option 3: MongoDB with Docker

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Troubleshooting

### Error: connect ECONNREFUSED
- **Atlas**: Check connection string, username, password, and IP whitelist
- **Local**: Ensure MongoDB service is running: `net start MongoDB`

### Authentication Failed
- **Atlas**: Verify username and password in connection string
- **Local**: No authentication needed by default

### Cannot find mongod
- **Windows**: Add MongoDB bin folder to PATH
  - Default: `C:\Program Files\MongoDB\Server\7.0\bin`

## Testing Connection

After setup, test with:
```bash
cd backend
node -e "require('./config/db')().then(() => { console.log('✅ Connected!'); process.exit(0); }).catch(err => { console.log('❌ Error:', err.message); process.exit(1); })"
```

## Next Steps

Once MongoDB is running:

1. **Seed the database**:
   ```bash
   cd backend
   npm run seed
   ```

2. **Start the backend**:
   ```bash
   npm start
   ```

3. **Start the frontend** (new terminal):
   ```bash
   cd frontend
   npm run dev
   ```

4. **Login**:
   - Open http://localhost:5173
   - Admin: `admin` / `admin123`
