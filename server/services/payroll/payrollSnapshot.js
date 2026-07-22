const PayrollConstants = require('../../constants/payrollConstants');

function buildEmployeeSnapshot(employee, payrollSettings) {

    if (!employee) {
        throw new Error('Employee is required.');
    }

    const basicSalary =
        employee.payrollProfile?.basicSalary ??
        employee.salary ??
        0;

    const workingDays =
        payrollSettings?.workingDaysPerMonth || 22;

    const workingHours =
        payrollSettings?.workingHoursPerDay || 8;

    const dailyRate =
        workingDays > 0
            ? basicSalary / workingDays
            : 0;

    const hourlyRate =
        workingHours > 0
            ? dailyRate / workingHours
            : 0;

    return {

        employeeId:
            employee.employeeId,

        firstName:
            employee.user?.firstName || '',

        lastName:
            employee.user?.lastName || '',

        email:
            employee.user?.email || '',

        department:
            employee.department || '',

        designation:
            employee.position || '',

        employmentType:
            employee.payrollProfile?.employmentType ||
            PayrollConstants.EMPLOYMENT_TYPE.PERMANENT,

        currency:
            employee.currency || 'KES',

        salary: {

            basic:
                basicSalary,

            dailyRate:
                Number(dailyRate.toFixed(2)),

            hourlyRate:
                Number(hourlyRate.toFixed(2)),

            payFrequency:
                payrollSettings?.payrollFrequency || 'monthly',

        },

        bankDetails: {

            bankName:
                employee.bankDetails?.bankName || '',

            accountNumber:
                employee.bankDetails?.accountNumber || '',

            accountName:
                employee.bankDetails?.accountName || '',

            branchCode:
                employee.bankDetails?.branchCode || '',

        },

        statutory: {

            taxPin:
                employee.taxPin || '',

            nhifNumber:
                employee.nhifNumber || '',

            nssfNumber:
                employee.nssfNumber || '',

            housingLevyNumber:
                employee.housingLevyNumber || '',

        },

        allowances: {

            housing:
                employee.payrollProfile?.allowances?.housing || 0,

            transport:
                employee.payrollProfile?.allowances?.transport || 0,

            medical:
                employee.payrollProfile?.allowances?.medical || 0,

            communication:
                employee.payrollProfile?.allowances?.communication || 0,

            hardship:
                employee.payrollProfile?.allowances?.hardship || 0,

            other:
                employee.payrollProfile?.allowances?.other || 0,

        },

        deductions: {

            loan:
                employee.payrollProfile?.deductions?.loan || 0,

            salaryAdvance:
                employee.payrollProfile?.deductions?.salaryAdvance || 0,

            sacco:
                employee.payrollProfile?.deductions?.sacco || 0,

            pension:
                employee.payrollProfile?.deductions?.pension || 0,

            insurance:
                employee.payrollProfile?.deductions?.insurance || 0,

            other:
                employee.payrollProfile?.deductions?.other || 0,

        },

    };

}

module.exports = {
    buildEmployeeSnapshot,
};