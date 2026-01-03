require('dotenv').config();
const mongoose = require('mongoose');
const Employee = require('../models/Employee');
const User = require('../models/User');

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('MONGODB_URI not set in .env');
  process.exit(1);
}

const args = process.argv.slice(2);
const [email, password, name = 'Admin User', company = 'Company', loginId] = args;

if (!email || !password) {
  console.error('Usage: node createAdmin.js <email> <password> [name] [company] [loginId]');
  process.exit(1);
}

const run = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      console.error('A user with that email already exists:', email);
      process.exit(1);
    }

    const employee = await Employee.create({
      name,
      email,
      company,
      status: 'present',
      isPresent: true
    });

    const newUser = await User.create({
      loginId: loginId || (email.split('@')[0]),
      email,
      password,
      role: 'admin',
      employeeId: employee._id
    });

    await Employee.findByIdAndUpdate(employee._id, { userId: newUser._id });

    console.log('Admin created:');
    console.log('  email:', newUser.email);
    console.log('  loginId:', newUser.loginId);
    console.log('  password:', password);

    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err.message || err);
    process.exit(1);
  }
};

run();
