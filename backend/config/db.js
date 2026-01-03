const mongoose = require('mongoose');

const ensureEmployeeDB = (uri) => {
  if (!uri) return uri;
  const dbName = 'employee_management';
  // If already contains the dbName, return as-is
  if (uri.includes(`/${dbName}`)) return uri;

  // Insert dbName before query string if present
  if (uri.includes('?')) {
    return uri.replace('?', `/${dbName}?`);
  }

  // Otherwise append the dbName
  return uri.endsWith('/') ? `${uri}${dbName}` : `${uri}/${dbName}`;
};

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;
    uri = ensureEmployeeDB(uri);
    if (!uri) throw new Error('MONGODB_URI is not defined');
    if (uri !== process.env.MONGODB_URI) {
      console.log('Adjusted MONGODB_URI to use employee_management database');
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
