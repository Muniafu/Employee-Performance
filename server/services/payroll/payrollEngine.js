const PayrollAttendanceService = require('./payrollAttendanceService');
const PayrollLeaveService = require('./payrollLeaveService');
const PayrollCalculator = require('./payrollCalculator');

const {
    validateGeneration,
} = require('./payrollValidator');

const {
    buildEmployeeSnapshot,
} = require('./payrollSnapshot');

class PayrollEngine {

    static async generate(
        employeeId,
        payrollPeriodId
    ) {

        /*
        =====================================================
        Validate Request
        =====================================================
        */

        const {

            employee,

            payrollPeriod,

            payrollSettings,

        } = await validateGeneration(

            employeeId,

            payrollPeriodId

        );

        /*
        =====================================================
        Employee Snapshot
        =====================================================
        */

        const employeeSnapshot =
            buildEmployeeSnapshot(

                employee,

                payrollSettings

            );

        /*
        =====================================================
        Attendance Summary
        =====================================================
        */

        const attendanceSummary =
            await PayrollAttendanceService.getSummary(

                employee,

                payrollPeriod,

                payrollSettings

            );

        /*
        =====================================================
        Leave Summary
        =====================================================
        */

        const leaveSummary =
            await PayrollLeaveService.getSummary(

                employee,

                payrollPeriod

            );

        /*
        =====================================================
        Merge Attendance + Leave
        =====================================================
        */

        const attendance = {

            ...attendanceSummary,

            paidLeaveDays:
                leaveSummary.paidLeaveDays,

            unpaidLeaveDays:
                leaveSummary.unpaidLeaveDays,

            absentDays:

                Math.max(

                    attendanceSummary.workingDays -

                    attendanceSummary.daysWorked -

                    leaveSummary.paidLeaveDays,

                    0

                ),

        };

        /*
        =====================================================
        Financial Calculation
        =====================================================
        */

        const payroll =
            PayrollCalculator.calculate({

                snapshot:
                    employeeSnapshot,

                payrollSettings,

                attendance,

            });

        /*
        =====================================================
        Payroll Document
        =====================================================
        */

        return {

            employee:
                employee._id,
            payrollPeriod:
                payrollPeriod._id,
            employeeSnapshot,
            attendanceSummary:
                attendance,
            earnings:
                payroll.earnings,
            statutory:
                payroll.statutory,
            deductions:
                payroll.deductions,
            totals:
                payroll.totals,
            workflow: {
                status: 'draft',
                generatedBy: null,
                generatedAt:
                    new Date(),
            },

            payment: {
                paymentStatus:
                    'pending',
                paymentMethod:
                    employee.payrollProfile
                        ?.paymentMethod ||
                    'bank',
            },

            payslip: {
                generated: false,
                generatedAt: null,
                downloadUrl: '',
            },

            auditTrail: [
                {
                    action:
                        'Payroll Generated',
                    performedBy: null,
                    remarks:
                        'Payroll draft created by Payroll Engine.',
                    timestamp:
                        new Date(),
                },
            ],

            metadata: {
                notes: '',
                version: 1,
            },
        };
    }
}

module.exports = PayrollEngine;