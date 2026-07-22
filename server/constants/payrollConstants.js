/*
=========================================================
PAYROLL WORKFLOW
=========================================================
*/

const PAYROLL_STATUS = Object.freeze({
    DRAFT: 'draft',
    REVIEW: 'review',
    APPROVED: 'approved',
    LOCKED: 'locked',
    PAID: 'paid',
    CANCELLED: 'cancelled',
});

/*
=========================================================
PAYROLL PERIOD
=========================================================
*/

const PAYROLL_PERIOD_STATUS = Object.freeze({
    OPEN: 'open',
    ATTENDANCE_LOCKED: 'attendance_locked',
    PROCESSING: 'processing',
    REVIEW: 'review',
    APPROVED: 'approved',
    LOCKED: 'locked',
    PAID: 'paid',
    CLOSED: 'closed',
});

/*
=========================================================
PAYMENT STATUS
=========================================================
*/

const PAYMENT_STATUS = Object.freeze({
    PENDING: 'pending',
    PROCESSING: 'processing',
    PAID: 'paid',
    FAILED: 'failed',
});

/*
=========================================================
PAYMENT METHODS
=========================================================
*/

const PAYMENT_METHOD = Object.freeze({
    BANK_TRANSFER: 'bank_transfer',
    MOBILE_MONEY: 'mobile_money',
    CASH: 'cash',
    CHEQUE: 'cheque',
});

/*
=========================================================
PAYROLL FREQUENCY
=========================================================
*/

const PAYROLL_FREQUENCY = Object.freeze({
    WEEKLY: 'weekly',
    BIWEEKLY: 'biweekly',
    MONTHLY: 'monthly',
});

/*
=========================================================
EMPLOYMENT TYPES
=========================================================
*/

const EMPLOYMENT_TYPE = Object.freeze({
    PERMANENT: 'permanent',
    CONTRACT: 'contract',
    INTERN: 'intern',
    CASUAL: 'casual',
    CONSULTANT: 'consultant',
});

/*
=========================================================
PAYMENT METHODS (EMPLOYEE PROFILE)
=========================================================
*/

const EMPLOYEE_PAYMENT_METHOD = Object.freeze({
    BANK: 'bank',
    MOBILE_MONEY: 'mobile_money',
    CASH: 'cash',
});

/*
=========================================================
ATTENDANCE STATUS
=========================================================
*/

const ATTENDANCE_STATUS = Object.freeze({
    PRESENT: 'present',
    ABSENT: 'absent',
    HALF_DAY: 'half_day',
    ON_LEAVE: 'on_leave',
});

/*
=========================================================
LEAVE TYPES
=========================================================
*/

const LEAVE_TYPE = Object.freeze({
    ANNUAL: 'annual',
    SICK: 'sick',
    MATERNITY: 'maternity',
    PATERNITY: 'paternity',
    UNPAID: 'unpaid',
    OTHER: 'other',
});

/*
=========================================================
LEAVE STATUS
=========================================================
*/

const LEAVE_STATUS = Object.freeze({
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    CANCELLED: 'cancelled',
});

module.exports = {
    PAYROLL_STATUS,
    PAYROLL_PERIOD_STATUS,
    PAYMENT_STATUS,
    PAYMENT_METHOD,
    PAYROLL_FREQUENCY,
    EMPLOYMENT_TYPE,
    EMPLOYEE_PAYMENT_METHOD,
    ATTENDANCE_STATUS,
    LEAVE_TYPE,
    LEAVE_STATUS,
};