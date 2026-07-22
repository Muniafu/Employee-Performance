const Employee = require('../../models/Employee');
const Payroll = require('../../models/Payroll');
const PayrollPeriod = require('../../models/PayrollPeriod');
const PayrollSettings = require('../../models/PayrollSettings');

const {
    PAYROLL_PERIOD_STATUS,
} = require('../../constants/payrollConstants');

async function validateGeneration(
    employeeId,
    payrollPeriodId
) {

    /*
    =====================================================
    Employee
    =====================================================
    */

    const employee =
        await Employee.findById(employeeId)
            .populate(
                'user',
                'firstName lastName email'
            );

    if (!employee) {
        throw new Error(
            'Employee not found.'
        );
    }

    /*
    =====================================================
    Payroll Eligibility
    =====================================================
    */

    if (!employee.isPayrollEligible()) {
        throw new Error(
            'Employee is not eligible for payroll.'
        );
    }

    /*
    =====================================================
    Payroll Period
    =====================================================
    */

    const payrollPeriod =
        await PayrollPeriod.findById(
            payrollPeriodId
        );

    if (!payrollPeriod) {
        throw new Error(
            'Payroll period not found.'
        );
    }

    /*
    =====================================================
    Payroll Period Status
    =====================================================
    */

    if (
        payrollPeriod.status !==
        PAYROLL_PERIOD_STATUS.ATTENDANCE_LOCKED
    ) {
        throw new Error(
            'Attendance must be locked before payroll generation.'
        );
    }

    /*
    =====================================================
    Duplicate Payroll
    =====================================================
    */

    const existingPayroll =
        await Payroll.findOne({

            employee: employee._id,

            payrollPeriod:
                payrollPeriod._id,

        });

    if (existingPayroll) {
        throw new Error(
            'Payroll already exists for this employee.'
        );
    }

    /*
    =====================================================
    Payroll Settings
    =====================================================
    */

    const payrollSettings =
        await PayrollSettings.findOne({

            active: true,

        });

    if (!payrollSettings) {
        throw new Error(
            'Active payroll settings not found.'
        );
    }

    if (payrollSettings.payrollLocked) {
        throw new Error(
            'Payroll generation is currently locked.'
        );
    }

    /*
    =====================================================
    Salary Validation
    =====================================================
    */

    const salary =
        employee.payrollProfile?.basicSalary ??
        employee.salary ??
        0;

    if (salary <= 0) {
        throw new Error(
            'Employee has no valid salary.'
        );
    }

    /*
    =====================================================
    Bank Details Validation
    =====================================================
    */

    if (
        employee.payrollProfile?.paymentMethod === 'bank'
    ) {

        if (
            !employee.bankDetails?.bankName ||
            !employee.bankDetails?.accountNumber
        ) {
            throw new Error(
                'Employee bank details are incomplete.'
            );
        }

    }

    /*
    =====================================================
    Return
    =====================================================
    */

    return {

        employee,

        payrollPeriod,

        payrollSettings,

    };

}

module.exports = {
    validateGeneration,
};