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
      },
      {
        name: 'Silky Pheasant',
        email: 'pheasant@company.com',
        mobile: '+1234567893',
        company: 'Tech Corp',
        department: 'Marketing',
        manager: 'Admin User',
        avatar: 'https://via.placeholder.com/150/ed8936',
        about: 'Marketing specialist focused on digital campaigns.',
        skills: ['SEO', 'Content Marketing', 'Analytics'],
        status: 'absent',
        isPresent: false
      },
      {
        name: 'Cheery Bison',
        email: 'bison@company.com',
        mobile: '+1234567894',
        company: 'Tech Corp',
        department: 'Sales',
        manager: 'Admin User',
        avatar: 'https://via.placeholder.com/150/764ba2',
        about: 'Sales executive with proven track record.',
        skills: ['Sales', 'Negotiation', 'CRM'],
        status: 'on-leave',
        isPresent: false
      },
      {
        name: 'Awesome Finch',
        email: 'finch@company.com',
        mobile: '+1234567895',
        company: 'Tech Corp',
        department: 'HR',
        manager: 'Admin User',
        avatar: 'https://via.placeholder.com/150/f56565',
        about: 'HR manager handling recruitment and employee relations.',
        skills: ['Recruitment', 'Employee Relations', 'Compliance'],
        status: 'present',
        isPresent: true
      }
    ]);

    console.log(`Created ${employees.length} sample employees`);

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

    console.log('Created user accounts for employees');

    // Create salary information for employees
    for (const emp of employees) {
      const monthlyWage = 50000 + Math.floor(Math.random() * 50000);
      await Salary.create({
        employeeId: emp._id,
        monthlyWage: monthlyWage,
        yearlyWage: monthlyWage * 12,
        workingDaysPerWeek: 5,
        breakTime: '1 hour',
        components: {
          basicSalary: { amount: monthlyWage * 0.5, percentage: 50 },
          houseRentAllowance: { amount: monthlyWage * 0.2, percentage: 20 },
          hraProvided: { amount: monthlyWage * 0.1, percentage: 10 },
          standardAllowance: { amount: monthlyWage * 0.1, percentage: 10 },
          performanceBonus: { amount: monthlyWage * 0.05, percentage: 5 },
          leaveTravelAllowance: { amount: monthlyWage * 0.05, percentage: 5 }
        },
        providentFund: {
          employee: monthlyWage * 0.12,
          employer: monthlyWage * 0.12
        }
      });
    }

    console.log('Created salary information');

    // Create attendance records for the last 7 days
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      for (const emp of employees) {
        if (Math.random() > 0.2) { // 80% attendance rate
          const checkIn = new Date(date);
          checkIn.setHours(9, 0, 0);
          const checkOut = new Date(date);
          checkOut.setHours(17 + Math.floor(Math.random() * 2), 0, 0);
          const totalHours = (checkOut - checkIn) / (1000 * 60 * 60);

          await Attendance.create({
            employeeId: emp._id,
            checkIn,
            checkOut,
            date: dateStr,
            totalHours: parseFloat(totalHours.toFixed(2)),
            status: 'present'
          });
        }
      }
    }

    console.log('Created attendance records');
    console.log('\n✅ Seed data created successfully!');
    console.log('\nLogin Credentials:');
    console.log('Admin: admin / admin123');
    console.log('Employee: sheep / password123');
    console.log('Employee: nightingale / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

connectDB().then(seedData);
