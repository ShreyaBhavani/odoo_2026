const User = require('../models/User');

const pad = (n, width) => String(n).padStart(width, '0');

/**
 * Generate loginId in format: OI + first2(firstname+lastname) + YYYY + serial(4)
 * Example: OIJODO20260001
 */
const generateLoginId = async (fullName, joinYear = new Date().getFullYear()) => {
  const prefix = 'OI';
  const names = (fullName || '').split(' ').filter(Boolean);
  const first = names[0] || '';
  const last = names.length > 1 ? names[names.length - 1] : '';
  const initials = (first.slice(0,2) + last.slice(0,2)).toUpperCase().padEnd(4, 'X');

  const year = String(joinYear);

  // Count existing users for this year to compute serial
  const regex = new RegExp(`^${prefix}${initials}${year}(\\d{4})$`);
  // To be safe count users with the year anywhere after prefix
  const count = await User.countDocuments({ loginId: { $regex: `^${prefix}${initials}${year}` } });
  const serial = pad(count + 1, 4);

  return `${prefix}${initials}${year}${serial}`;
};

module.exports = { generateLoginId };
