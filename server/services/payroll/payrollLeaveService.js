const Leave = require('../../models/Leave');

class PayrollLeaveService {

    static async getSummary(
        employee,
        payrollPeriod
    ) {

        const approvedLeaves =
            await Leave.find({

                employee: employee._id,

                status: 'approved',

                startDate: {
                    $lte: payrollPeriod.endDate,
                },

                endDate: {
                    $gte: payrollPeriod.startDate,
                },

            }).lean();

        let paidLeaveDays = 0;

        let unpaidLeaveDays = 0;

        const leaveDetails = [];

        for (const leave of approvedLeaves) {

            /*
            ============================================
            Clip Leave To Payroll Period
            ============================================
            */

            const effectiveStart =

                leave.startDate > payrollPeriod.startDate

                    ? leave.startDate

                    : payrollPeriod.startDate;

            const effectiveEnd =

                leave.endDate < payrollPeriod.endDate

                    ? leave.endDate

                    : payrollPeriod.endDate;

            const milliseconds =

                effectiveEnd - effectiveStart;

            const leaveDays =

                Math.floor(

                    milliseconds /

                    (1000 * 60 * 60 * 24)

                ) + 1;

            if (leaveDays <= 0) {

                continue;

            }

            /*
            ============================================
            Paid / Unpaid
            ============================================
            */

            const isPaidLeave = [
                'annual',
                'sick',
                'maternity',
                'paternity',

            ].includes(
                leave.leaveType
            );

            if (isPaidLeave) {
                paidLeaveDays += leaveDays;
            }

            else {
                unpaidLeaveDays += leaveDays;
            }

            leaveDetails.push({
                leaveId: leave._id,
                leaveType: leave.leaveType,
                startDate: effectiveStart,
                endDate: effectiveEnd,
                days: leaveDays,
                paid: isPaidLeave,
            });
        }

        return {
            paidLeaveDays,
            unpaidLeaveDays,
            totalLeaveDays:
                paidLeaveDays +
                unpaidLeaveDays,
            leaveDetails,
        };
    }
}

module.exports =  PayrollLeaveService;