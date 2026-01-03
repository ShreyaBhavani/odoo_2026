require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Employee = require('./models/Employee');
const Salary = require('./models/Salary');
const Attendance = require('./models/Attendance');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

const cleanData = async () => {
  try {
    console.log('Clearing all default seeded data...');
    
    // Delete all users (removes all test accounts)
    const usersDeleted = await User.deleteMany({});
    console.log(`Deleted ${usersDeleted.deletedCount} users`);
    
    // Delete all employees (removes all test employees)
    const employeesDeleted = await Employee.deleteMany({});
    console.log(`Deleted ${employeesDeleted.deletedCount} employees`);
    
    // Delete all salary records
    const salaryDeleted = await Salary.deleteMany({});
    console.log(`Deleted ${salaryDeleted.deletedCount} salary records`);
    
    // Delete all attendance records
    const attendanceDeleted = await Attendance.deleteMany({});
    console.log(`Deleted ${attendanceDeleted.deletedCount} attendance records`);
    
    console.log('\n✅ All default data has been cleared!');
    console.log('Database is now empty. Ready for user-created data only.');
    
    process.exit(0);
  } catch (error) {
    console.error('Clean error:', error);
    process.exit(1);
  }
};

connectDB().then(cleanData);
