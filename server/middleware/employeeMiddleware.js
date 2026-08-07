const Employee = require('../models/Employee');

exports.requireEmployeeProfile = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated.',
      });
    }

    if (!req.user.employeeId) {
      return res.status(403).json({
        success: false,
        message: 'Employee profile required.',
      });
    }

    const employee = await Employee.findById(
      req.user.employeeId
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee profile missing.',
      });
    }

    if (employee.status === 'terminated') {
      return res.status(403).json({
        success: false,
        message:
          'Terminated employees cannot record attendance.',
      });
    }

    req.employee = employee;

    next();
  } catch (err) {
    next(err);
  }
};