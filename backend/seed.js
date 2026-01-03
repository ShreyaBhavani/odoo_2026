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

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Employee.deleteMany({});
    await Salary.deleteMany({});
    await Attendance.deleteMany({});

    console.log('Cleared existing data');

    // Create admin user
    const adminEmployee = await Employee.create({
      name: 'Admin User',
      email: 'admin@company.com',
      mobile: '+1234567890',
      company: 'Tech Corp',
      department: 'Management',
      manager: 'CEO',
      about: 'System administrator with full access rights.',
      skills: ['Management', 'Leadership', 'Administration'],
      status: 'present',
      isPresent: true
    });

    await User.create({
      loginId: 'admin',
      email: 'admin@company.com',
      password: 'admin123',
      role: 'admin',
      employeeId: adminEmployee._id
    });

    console.log('Admin user created (admin / admin123)');

    // Create sample employees
    const employees = await Employee.create([
      {
        name: 'Beneficial Sheep',
        email: 'sheep@company.com',
        mobile: '+1234567891',
        company: 'Tech Corp',
        department: 'Engineering',
        manager: 'Admin User',
        avatar: 'https://via.placeholder.com/150/48bb78',
        about: 'Senior software engineer with 5 years of experience.',
        skills: ['JavaScript', 'React', 'Node.js'],
        status: 'present',
        isPresent: true
      },
      {
        name: 'Green Nightingale',
        email: 'nightingale@company.com',
        mobile: '+1234567892',
        company: 'Tech Corp',
        department: 'Design',
        manager: 'Admin User',
        avatar: 'https://via.placeholder.com/150/667eea',
        about: 'Creative UI/UX designer passionate about user experience.',
        skills: ['Figma', 'Adobe XD', 'Design Systems'],
        status: 'present',
        isPresent: true
      }
    ]);

    // Create users for employees
    for (const emp of employees) {
      await User.create({
        loginId: emp.email.split('@')[0],
        email: emp.email,
        password: 'password123',
        role: 'employee',
        employeeId: emp._id
      });
    }

    console.log('Created sample employees and users');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

connectDB().then(seedData);
