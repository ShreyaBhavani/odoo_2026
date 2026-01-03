require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const [loginId, newPassword] = process.argv.slice(2);
if (!loginId || !newPassword) {
  console.error('Usage: node resetPassword.js <loginId> <newPassword>');
  process.exit(1);
}

const run = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not set in .env');
    await mongoose.connect(uri);
    const user = await User.findOne({ loginId });
    if (!user) {
      console.error('User not found:', loginId);
      process.exit(1);
    }
    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    await user.save();
    console.log('Password reset for', loginId);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
  }
};

run();
