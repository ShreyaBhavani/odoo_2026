# Quick Start Guide

## Starting MongoDB

### Option 1: Local MongoDB
If you have MongoDB installed locally:
```bash
# Windows
mongod --dbpath="C:\data\db"

# Or use MongoDB as a Windows service
net start MongoDB
```

### Option 2: MongoDB Atlas (Cloud)
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `.env` file:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/employee_management
```

## Running the Application

### Terminal 1 - Backend
```bash
cd backend
npm start
```
Server runs on: http://localhost:5000

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
Frontend runs on: http://localhost:5173

## First Time Setup
```bash
# Seed sample data (only run once)
cd backend
npm run seed
```

## Login Credentials
- Admin: `admin` / `admin123`
- Employee: `sheep` / `password123`
