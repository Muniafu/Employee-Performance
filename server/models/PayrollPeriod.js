const mongoose = require('mongoose');

const {
    PAYROLL_PERIOD_STATUS,
    PAYROLL_FREQUENCY,
} = require('../constants/payrollConstants');

const payrollPeriodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    year: {
      type: Number,
      required: true,
      min: 2000,
    },

    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },

    payrollFrequency: {
      type: String,
      enum: Object.values(PAYROLL_FREQUENCY),
      default: PAYROLL_FREQUENCY.MONTHLY,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    payDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(PAYROLL_PERIOD_STATUS),
      default: PAYROLL_PERIOD_STATUS.OPEN,
    },

    attendanceLocked: {
      type: Boolean,
      default: false,
    },

    payrollLocked: {
      type: Boolean,
      default: false,
    },

    paymentLocked: {
      type: Boolean,
      default: false,
    },

    createdFrom: {
      type: String,
      enum: ['manual', 'system'],
      default: 'manual',
    },

    payrollCalculated: {
      type: Boolean,
      default: false,
    },

    periodNumber: {
      type: Number,
      required: true,
      min: 1,
    },

    payslipsGenerated: {
      type: Boolean,
      default: false,
    },

    totalEmployees: {
      type: Number,
      default: 0,
      min: 0,
    },

    attendanceSummary:{
      totalWorkingDays:{
        type: Number,
        default: 0,
      },

      totalAttendanceRecords:{
        type: Number,
        default: 0,
      },

      totalOvertimeHours:{
        type: Number,
        default: 0,
      },
    },

    processedEmployees: {
      type: Number,
      default: 0,
      min: 0,
    },

    approvedEmployees: {
      type: Number,
      default: 0,
      min: 0,
    },

    paidEmployees: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalGrossPay: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalNetPay: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalDeductions: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalEmployeeCost:{
      type: Number,
      default: 0,
    },

    totalOvertime: {
      type: Number,
      default: 0,
      min: 0,
    },

    fiscalYear: {
      type: Number,
      required: true,
      min: 2000,
    },

    notes: {
      type: String,
      default: '',
      trim: true,
    },

    internalRemarks: {
      type: String,
      default: '',
    },

    openedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    attendanceLockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    calculatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    closedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    lastUpdatedAt: {
      type: Date,
    },

    attendanceLockedAt: Date,

    calculatedAt: Date,

    approvedAt: Date,

    paidAt: Date,

    closedAt: Date,
  },
  {
    timestamps: true,
  }
);

payrollPeriodSchema.index(
  {
    year: 1,
    month: 1,
  },
  {
    unique: true,
  }
);

payrollPeriodSchema.index({
  status: 1,
});

payrollPeriodSchema.index({
  status:1,
  year:-1,
  month:-1,
});

payrollPeriodSchema.index({
  payDate:1,
});

payrollPeriodSchema.methods.isOpen = function(){
  return this.status===PAYROLL_PERIOD_STATUS.OPEN;
};

payrollPeriodSchema.methods.isOpen = function(){
  return this.status===PAYROLL_PERIOD_STATUS.OPEN;
};

payrollPeriodSchema.methods.canGeneratePayroll = function(){
  return this.status===PAYROLL_PERIOD_STATUS.ATTENDANCE_LOCKED;

};

payrollPeriodSchema.virtual('period').get(function () {
  return `${this.year}-${String(this.month).padStart(2, '0')}`;
});

payrollPeriodSchema.virtual( 'displayName' ).get(function(){
  return `${this.name} (${this.period})`;
});

payrollPeriodSchema.pre('validate', function (next) {

  if (this.endDate <= this.startDate) {
    return next(
      new Error('End date must be after start date.')
    );
  }

  if (this.payDate <= this.endDate) {
    return next(
      new Error('Pay date cannot be before payroll end date.')
    );
  }

  next();
});

module.exports = mongoose.model(
  'PayrollPeriod',
  payrollPeriodSchema
);