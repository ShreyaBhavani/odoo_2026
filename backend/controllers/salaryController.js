const Salary = require('../models/Salary');

// @desc    Get salary info
// @route   GET /api/salary/:employeeId
// @access  Private/Admin
exports.getSalary = async (req, res) => {
  try {
    const salary = await Salary.findOne({ 
      employeeId: req.params.employeeId 
    }).populate('employeeId', 'name email');
    
    if (!salary) {
      return res.status(404).json({ message: 'Salary information not found' });
    }
    
    res.json({ success: true, data: salary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create/Update salary
// @route   POST /api/salary
// @access  Private/Admin
exports.createOrUpdateSalary = async (req, res) => {
  try {
    const { employeeId } = req.body;
    
    let salary = await Salary.findOne({ employeeId });
    
    if (salary) {
      salary = await Salary.findOneAndUpdate(
        { employeeId },
        req.body,
        { new: true, runValidators: true }
      );
    } else {
      salary = await Salary.create(req.body);
    }
    
    res.status(201).json({ success: true, data: salary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete salary info
// @route   DELETE /api/salary/:employeeId
// @access  Private/Admin
exports.deleteSalary = async (req, res) => {
  try {
    const salary = await Salary.findOneAndDelete({ 
      employeeId: req.params.employeeId 
    });
    
    if (!salary) {
      return res.status(404).json({ message: 'Salary information not found' });
    }
    
    res.json({ success: true, message: 'Salary information deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
