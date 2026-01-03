const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  monthlyWage: {
    type: Number,
    required: true
  },
  yearlyWage: {
    type: Number,
    required: true
  },
  workingDaysPerWeek: {
    type: Number,
    default: 5
  },
  breakTime: String,
  components: {
    basicSalary: {
      amount: Number,
      percentage: Number
    },
    houseRentAllowance: {
      amount: Number,
      percentage: Number
    },
    hraProvided: {
      amount: Number,
      percentage: Number
    },
    standardAllowance: {
      amount: Number,
      percentage: Number
    },
    performanceBonus: {
      amount: Number,
      percentage: Number
    },
    leaveTravelAllowance: {
      amount: Number,
      percentage: Number
    },
    professionalTax: {
      amount: Number,
      percentage: Number
    },
    fixedAllowance: {
      amount: Number,
      percentage: Number
    }
  },
  providentFund: {
    employee: Number,
    employer: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Salary', salarySchema);
