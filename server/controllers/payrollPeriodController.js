// server/controllers/payrollPeriodController.js

const Payroll = require('../models/Payroll');
const PayrollPeriod = require('../models/PayrollPeriod');

const {
  successResponse,
  errorResponse,
} = require('../utils/responseHandler');

/*
==========================================================
CREATE PAYROLL PERIOD
==========================================================
*/

const createPeriod = async (req, res) => {
  try {
    const period = await PayrollPeriod.create({
      ...req.body,
      openedBy: req.user.id,
    });

    return successResponse(
      res,
      201,
      'Payroll period created successfully.',
      period
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

/*
==========================================================
GET ALL PERIODS
==========================================================
*/

const getAllPeriods = async (req, res) => {
  try {
    const periods = await PayrollPeriod.find()
      .sort({
        year: -1,
        month: -1,
      });

    return successResponse(
      res,
      200,
      'Payroll periods retrieved successfully.',
      periods
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

/*
==========================================================
GET SINGLE PERIOD
==========================================================
*/

const getPeriod = async (req, res) => {
  try {
    const period = await PayrollPeriod.findById(
      req.params.id
    );

    if (!period) {
      return errorResponse(
        res,
        'Payroll period not found.',
        404
      );
    }

    return successResponse(
      res,
      200,
      'Payroll period retrieved successfully.',
      period
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

/*
==========================================================
UPDATE PERIOD
==========================================================
*/

const updatePeriod = async (req, res) => {
  try {
    const period =
      await PayrollPeriod.findById(
        req.params.id
      );

    if (!period) {
      return errorResponse(
        res,
        'Payroll period not found.',
        404
      );
    }

    if (
      ['locked', 'paid', 'closed'].includes(
        period.status
      )
    ) 
    
    Object.assign(period, req.body);

    await period.save();

    return successResponse(
      res,
      200,
      'Payroll period updated successfully.',
      period
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

/*
==========================================================
DELETE PERIOD
==========================================================
*/

const deletePeriod = async (req, res) => {
  try {
    const payrollCount =
      await Payroll.countDocuments({
        payrollPeriod: req.params.id,
      });

    if (payrollCount > 0) {
      return errorResponse(
        res,
        'Payroll period already contains payroll records.',
        400
      );
    }

    const period =
      await PayrollPeriod.findByIdAndDelete(
        req.params.id
      );

    if (!period) {
      return errorResponse(
        res,
        'Payroll period not found.',
        404
      );
    }

    return successResponse(
      res,
      200,
      'Payroll period deleted successfully.'
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

/*
==========================================================
LOCK ATTENDANCE
==========================================================
*/

const lockAttendance = async (req, res) => {
  try {
    const period =
      await PayrollPeriod.findById(
        req.params.id
      );

    if (!period) {
      return errorResponse(
        res,
        'Payroll period not found.',
        404
      );
    }

    period.status = 'attendance_locked';
    period.attendanceLocked = true;
    period.attendanceLockedBy = req.user.id;
    period.attendanceLockedAt = new Date();

    await period.save();

    return successResponse(
      res,
      200,
      'Attendance locked successfully.',
      period
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

/*
==========================================================
START PROCESSING
==========================================================
*/

const startProcessing = async (req, res) => {
  try {
    const period =
      await PayrollPeriod.findById(
        req.params.id
      );

    if (!period) {
      return errorResponse(
        res,
        'Payroll period not found.',
        404
      );
    }

    period.status = 'processing';
    period.calculatedBy = req.user.id;
    period.calculatedAt = new Date();

    await period.save();

    return successResponse(
      res,
      200,
      'Payroll processing started.',
      period
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

/*
==========================================================
APPROVE PERIOD
==========================================================
*/

const approvePeriod = async (req, res) => {
  try {
    const period =
      await PayrollPeriod.findById(
        req.params.id
      );

    if (!period) {
      return errorResponse(
        res,
        'Payroll period not found.',
        404
      );
    }

    period.status = 'approved';
    period.approvedBy = req.user.id;
    period.approvedAt = new Date();

    await period.save();

    return successResponse(
      res,
      200,
      'Payroll approved.',
      period
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

/*
==========================================================
LOCK PAYROLL
==========================================================
*/

const lockPayroll = async (req, res) => {
  try {
    const period =
      await PayrollPeriod.findById(
        req.params.id
      );

    if (!period) {
      return errorResponse(
        res,
        'Payroll period not found.',
        404
      );
    }

    period.status = 'locked';

    await period.save();

    return successResponse(
      res,
      200,
      'Payroll locked successfully.',
      period
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

/*
==========================================================
MARK PAID
==========================================================
*/

const markPaid = async (req, res) => {
  try {
    const period =
      await PayrollPeriod.findById(
        req.params.id
      );

    if (!period) {
      return errorResponse(
        res,
        'Payroll period not found.',
        404
      );
    }

    period.status = 'paid';
    period.paidBy = req.user.id;
    period.paidAt = new Date();

    await period.save();

    return successResponse(
      res,
      200,
      'Payroll marked as paid.',
      period
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

/*
==========================================================
CLOSE PERIOD
==========================================================
*/

const closePeriod = async (req, res) => {
  try {
    const period =
      await PayrollPeriod.findById(
        req.params.id
      );

    if (!period) {
      return errorResponse(
        res,
        'Payroll period not found.',
        404
      );
    }

    period.status = 'closed';
    period.closedBy = req.user.id;
    period.closedAt = new Date();

    await period.save();

    return successResponse(
      res,
      200,
      'Payroll period closed successfully.',
      period
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

module.exports = {
  createPeriod,
  getAllPeriods,
  getPeriod,
  updatePeriod,
  deletePeriod,
  lockAttendance,
  startProcessing,
  approvePeriod,
  lockPayroll,
  markPaid,
  closePeriod,
};