const mongoose = require('mongoose');

const {
  PAYROLL_FREQUENCY,
} = require('../constants/payrollConstants');

/*
=========================================================
ALLOWANCE SCHEMA
=========================================================
*/

const allowanceSchema = new mongoose.Schema(
  {
    housing: {
      type: Number,
      default: 0,
      min: 0,
    },

    transport: {
      type: Number,
      default: 0,
      min: 0,
    },

    medical: {
      type: Number,
      default: 0,
      min: 0,
    },

    communication: {
      type: Number,
      default: 0,
      min: 0,
    },

    hardship: {
      type: Number,
      default: 0,
      min: 0,
    },

    other: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

/*
=========================================================
DEDUCTION RULE SCHEMA
=========================================================
*/

const deductionRuleSchema = new mongoose.Schema(
  {
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: false,
  }
);

/*
=========================================================
PAYROLL SETTINGS
=========================================================
*/

const payrollSettingsSchema = new mongoose.Schema(
  {
    /*
    =====================================================
    COMPANY
    =====================================================
    */

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    companyCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      unique: true,
    },

    currency: {
      type: String,
      default: 'KES',
      uppercase: true,
      trim: true,
    },

    /*
    =====================================================
    PAYROLL CONFIGURATION
    =====================================================
    */

    payrollFrequency: {
      type: String,
      enum: Object.values(PAYROLL_FREQUENCY),
      default: PAYROLL_FREQUENCY.MONTHLY,
    },

    payDay: {
      type: Number,
      default: 28,
      min: 1,
      max: 31,
    },

    workingDaysPerMonth: {
      type: Number,
      default: 22,
      min: 1,
    },

    workingHoursPerDay: {
      type: Number,
      default: 8,
      min: 1,
    },

    weekStartsOn: {
      type: String,
      enum: ['monday', 'sunday'],
      default: 'monday',
    },

    /*
    =====================================================
    OVERTIME
    =====================================================
    */

    overtime: {
      enabled: {
        type: Boolean,
        default: true,
      },

      multiplier: {
        type: Number,
        default: 1.5,
        min: 1,
      },

      weekendMultiplier: {
        type: Number,
        default: 2,
        min: 1,
      },

      holidayMultiplier: {
        type: Number,
        default: 2,
        min: 1,
      },
    },

    /*
    =====================================================
    STATUTORY DEDUCTIONS
    =====================================================
    */

    deductions: {
      paye: {
        type: deductionRuleSchema,
        default: () => ({}),
      },

      nhif: {
        type: deductionRuleSchema,
        default: () => ({}),
      },

      nssf: {
        type: deductionRuleSchema,
        default: () => ({}),
      },

      housingLevy: {
        type: deductionRuleSchema,
        default: () => ({}),
      },
    },

    /*
    =====================================================
    STATUTORY RATES
    =====================================================
    */

    statutoryRates: {
      housingLevyRate: {
        type: Number,
        default: 0.015,
        min: 0,
      },

      employerHousingLevyRate: {
        type: Number,
        default: 0.015,
        min: 0,
      },

      employerNSSFRate: {
        type: Number,
        default: 0.06,
        min: 0,
      },
    },

    /*
    =====================================================
    ATTENDANCE RULES
    =====================================================
    */

    attendance: {
      deductAbsentDays: {
        type: Boolean,
        default: true,
      },

      deductLateDays: {
        type: Boolean,
        default: false,
      },
    },

    /*
    =====================================================
    DEFAULT ALLOWANCES
    =====================================================
    */

    defaultAllowances: {
      type: allowanceSchema,
      default: () => ({}),
    },

    /*
    =====================================================
    TAX RELIEFS
    =====================================================
    */

    taxReliefs: {
      personalRelief: {
        type: Number,
        default: 2400,
        min: 0,
      },

      insuranceRelief: {
        type: Number,
        default: 0,
        min: 0,
      },

      pensionRelief: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    /*
    =====================================================
    PAYROLL RULES
    =====================================================
    */

    payrollRules: {
      allowNegativeNetPay: {
        type: Boolean,
        default: false,
      },

      autoGeneratePayslip: {
        type: Boolean,
        default: true,
      },

      requireApproval: {
        type: Boolean,
        default: true,
      },
    },

    /*
    =====================================================
    SYSTEM STATUS
    =====================================================
    */

    payrollLocked: {
      type: Boolean,
      default: false,
    },

    active: {
      type: Boolean,
      default: true,
    },

    /*
    =====================================================
    AUDIT
    =====================================================
    */

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    lastReviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    lastReviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

/*
=========================================================
INDEXES
=========================================================
*/

payrollSettingsSchema.index(
  {
    active: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      active: true,
    },
  }
);

/*
=========================================================
INSTANCE METHODS
=========================================================
*/

payrollSettingsSchema.methods.isMonthly =
  function () {
    return (
      this.payrollFrequency ===
      PAYROLL_FREQUENCY.MONTHLY
    );
  };

payrollSettingsSchema.methods.isWeekly =
  function () {
    return (
      this.payrollFrequency ===
      PAYROLL_FREQUENCY.WEEKLY
    );
  };

payrollSettingsSchema.methods.isBiWeekly =
  function () {
    return (
      this.payrollFrequency ===
      PAYROLL_FREQUENCY.BIWEEKLY
    );
  };

module.exports = mongoose.model(
  'PayrollSettings',
  payrollSettingsSchema
);