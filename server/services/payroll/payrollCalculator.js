const {
    computePAYE,
    computeNHIF,
    computeNSSF,
    computeOvertimePay,
} = require('../../utils/payrollHelper');

class PayrollCalculator {

    static calculate({

        snapshot,

        payrollSettings,

        attendance,

    }) {

        /*
        ============================================
        Salary Rates
        ============================================
        */

        const basicSalary =
            snapshot.salary.basic;

        const dailyRate =
            snapshot.salary.dailyRate;

        const hourlyRate =
            snapshot.salary.hourlyRate;

        /*
        ============================================
        Attendance
        ============================================
        */

        const payableDays =
            attendance.daysWorked +
            attendance.paidLeaveDays;

        const earnedBasicSalary =
            Math.round(
                dailyRate *
                payableDays
            );

        /*
        ============================================
        Overtime
        ============================================
        */

        const overtimePay =
            payrollSettings.overtime.enabled

                ? computeOvertimePay(

                    hourlyRate,

                    attendance.overtimeHours,

                    payrollSettings.overtime.multiplier

                )

                : 0;

        /*
        ============================================
        Allowances
        ============================================
        */

        const allowances = {

            ...snapshot.allowances,

        };

        const totalAllowances =
            Object
                .values(allowances)
                .reduce(
                    (sum, value) =>
                        sum + value,
                    0
                );

        /*
        ============================================
        Variable Earnings
        ============================================
        */

        const bonuses = 0;

        const commissions = 0;

        const reimbursements = 0;

        /*
        ============================================
        Gross Pay
        ============================================
        */

        const grossPay =

            earnedBasicSalary +

            overtimePay +

            totalAllowances +

            bonuses +

            commissions +

            reimbursements;

        /*
        ============================================
        Statutory
        ============================================
        */

        const paye =

            payrollSettings.deductions
                .paye.enabled

                ? computePAYE(grossPay)

                : 0;

        const nhif =

            payrollSettings.deductions
                .nhif.enabled

                ? computeNHIF(grossPay)

                : 0;

        const nssf =

            payrollSettings.deductions
                .nssf.enabled

                ? computeNSSF(grossPay)

                : 0;

        const housingLevy =

            payrollSettings.deductions
                .housingLevy.enabled

                ? Math.round(

                    grossPay *

                    payrollSettings
                        .statutoryRates
                        .housingLevyRate

                )

                : 0;

        /*
        ============================================
        Employee Deductions
        ============================================
        */

        const deductions = {

            ...snapshot.deductions,

        };

        const totalEmployeeDeductions =

            Object
                .values(deductions)
                .reduce(
                    (sum, value) =>
                        sum + value,
                    0
                );

        /*
        ============================================
        Statutory Total
        ============================================
        */

        const statutory = {

            paye,

            nhif,

            nssf,

            housingLevy,

        };

        const totalStatutory =

            Object
                .values(statutory)
                .reduce(
                    (sum, value) =>
                        sum + value,
                    0
                );

        /*
        ============================================
        Employer Contributions
        ============================================
        */

        const employerHousingLevy =

            Math.round(

                grossPay *

                payrollSettings
                    .statutoryRates
                    .employerHousingLevyRate

            );

        const employerNSSF =

            Math.round(

                grossPay *

                payrollSettings
                    .statutoryRates
                    .employerNSSFRate

            );

        const totalEmployerContributions =

            employerHousingLevy +

            employerNSSF;

        /*
        ============================================
        Totals
        ============================================
        */

        const taxableIncome =

            grossPay -

            nssf;

        const totalDeductions =
            totalEmployeeDeductions +
            totalStatutory;

        const netPay =
            Math.max(
                grossPay -
                totalDeductions,
                0
            );

        return {
            earnings: {
                basicSalary:
                    earnedBasicSalary,
                overtimePay,
                allowances,
                bonuses,
                commissions,
                reimbursements,
                grossPay,
            },

            statutory,
            deductions,
            totals: {
                taxableIncome,
                totalAllowances,
                totalStatutory,
                totalEmployeeDeductions,
                totalEmployerContributions,
                totalDeductions,
                grossPay,
                netPay,
            },
        };
    }
}

module.exports = PayrollCalculator;