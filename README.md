# odoo_2026

# Dayflow Human Resource Management System

A full-stack employee management application with React frontend and Node.js/Express backend following MVC architecture.

## Features

- 🔐 JWT Authentication with role-based access control (Admin/Employee)
- 👥 Employee Management (CRUD operations)
- ⏰ Check-in/Check-out Attendance System
- 💰 Salary Management (Admin only)
- 📊 Employee Profile with multiple tabs
- 🎨 Modern, professional UI
- 🔒 Security features: Helmet, Rate Limiting, Password Hashing

## Tech Stack

### Backend
- Node.js & Express.js (MVC Architecture)
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing
- express-validator for input validation
- helmet for security headers
- express-rate-limit for API rate limiting

### Frontend
- React with Vite
- React Router for navigation
- Axios for API calls
- Context API for state management
- Modern CSS with responsive design

## Project Structure

```
odoo_2026/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic (MVC Controllers)
│   ├── models/          # MongoDB models (MVC Models)
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & validation middleware
│   ├── server.js        # Express server
│   ├── seed.js          # Sample data seeder
│   └── .env             # Environment variables
└── frontend/
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── context/     # React Context
    │   ├── pages/       # Page components (MVC Views)
    │   ├── services/    # API service layer
    │   └── App.jsx      # Main app component
    └── vite.config.js   # Vite configuration
```

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies (already done):
```bash
npm install
```

3. Update `.env` file if needed:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/employee_management
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
NODE_ENV=development
```

4. Make sure MongoDB is running

5. Seed sample data:
```bash
npm run seed
```

6. Start the server:
```bash
npm start
```

Backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies (already done):
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend will run on http://localhost:5173

## Default Login Credentials

### Admin Account
- Login ID: `admin`
- Password: `admin123`

### Employee Accounts
- Login ID: `sheep` / Password: `password123`
- Login ID: `nightingale` / Password: `password123`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Employees
- `GET /api/employees` - Get all employees (protected)
- `GET /api/employees/:id` - Get employee by ID (protected)
- `POST /api/employees` - Create employee (admin only)
- `PUT /api/employees/:id` - Update employee (protected)
- `DELETE /api/employees/:id` - Delete employee (admin only)

### Attendance
- `POST /api/attendance/checkin` - Check in (protected)
- `POST /api/attendance/checkout` - Check out (protected)
- `GET /api/attendance/:employeeId` - Get employee attendance (protected)
- `GET /api/attendance/all` - Get all attendance (admin only)

### Salary
- `GET /api/salary/:employeeId` - Get salary info (admin only)
- `POST /api/salary` - Create/Update salary (admin only)
- `DELETE /api/salary/:employeeId` - Delete salary (admin only)

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected routes with middleware
- Role-based access control
- Input validation
- Rate limiting (100 requests per 15 minutes)
- Security headers with Helmet
- CORS configuration

## UI Features

- Professional gradient design
- Responsive layout
- Employee cards with status indicators
- Profile pages with multiple tabs
- Check-in/Check-out functionality
- Search and filter employees
- Modern form styling
- Smooth animations and transitions

## Development

### Backend Development
The backend follows MVC architecture:
- **Models**: Database schemas (User, Employee, Attendance, Salary)
- **Controllers**: Business logic for each resource
- **Views**: API responses (JSON)
- **Routes**: URL endpoints mapped to controllers

### Frontend Development
The frontend uses React with component-based architecture:
- **Pages**: Main views (Login, Dashboard, EmployeeProfile)
- **Components**: Reusable UI components
- **Context**: Global state management (Auth)
- **Services**: API communication layer
