require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const run = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not set in .env');
    await mongoose.connect(uri);
    console.log('Connected to', uri);

    const users = await User.find().select('loginId email isActive createdAt').lean();
    console.log('Users:', users.length);
    users.forEach(u => {
      console.log(`- loginId: ${u.loginId} | email: ${u.email} | isActive: ${u.isActive} | createdAt: ${u.createdAt}`);
    });

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

run();
