const Payroll = require('../../models/Payroll');
const PayrollPeriod = require('../../models/PayrollPeriod');

class PayrollPeriodService {

  /*
  =====================================================
  CREATE
  =====================================================
  */

  static async create(data, userId) {

    const exists =
      await PayrollPeriod.findOne({

        year: data.year,

        month: data.month,

      });

    if (exists) {
      throw new Error(
        'Payroll period already exists.'
      );
    }

    return PayrollPeriod.create({

      ...data,

      openedBy: userId,

      status: 'open',

    });

  }

  /*
  =====================================================
  UPDATE
  =====================================================
  */

  static async update(
    id,
    data
  ) {

    const period =
      await PayrollPeriod.findById(id);

    if (!period) {
      throw new Error(
        'Payroll period not found.'
      );
    }

    if (
      [
        'locked',
        'paid',
        'closed',
      ].includes(period.status)
    ) {
      throw new Error(
        'Locked payroll periods cannot be modified.'
      );
    }

    Object.assign(
      period,
      data
    );

    await period.save();

    return period;

  }

  /*
  =====================================================
  DELETE
  =====================================================
  */

  static async delete(id) {

    const payrolls =
      await Payroll.countDocuments({

        payrollPeriod: id,

      });

    if (payrolls > 0) {
      throw new Error(
        'Cannot delete payroll period with payroll records.'
      );
    }

    const period =
      await PayrollPeriod.findByIdAndDelete(id);

    if (!period) {
      throw new Error(
        'Payroll period not found.'
      );
    }

    return period;

  }

  /*
  =====================================================
  CHANGE STATUS
  =====================================================
  */

  static async changeStatus(
    id,
    status,
    userId
  ) {

    const period =
      await PayrollPeriod.findById(id);

    if (!period) {
      throw new Error(
        'Payroll period not found.'
      );
    }

    const transitions = {

      open: [
        'attendance_locked',
      ],

      attendance_locked: [
        'processing',
      ],

      processing: [
        'review',
      ],

      review: [
        'approved',
      ],

      approved: [
        'locked',
      ],

      locked: [
        'paid',
      ],

      paid: [
        'closed',
      ],

      closed: [],

    };

    if (
      !transitions[
        period.status
      ].includes(status)
    ) {

      throw new Error(
        `Invalid transition from ${period.status} to ${status}.`
      );

    }

    period.status = status;

    switch (status) {

      case 'attendance_locked':

        period.attendanceLocked = true;

        period.attendanceLockedBy = userId;

        period.attendanceLockedAt = new Date();

        break;

      case 'processing':

        period.calculatedBy = userId;

        period.calculatedAt = new Date();

        break;

      case 'approved':

        period.approvedBy = userId;

        period.approvedAt = new Date();

        break;

      case 'paid':

        period.paidBy = userId;

        period.paidAt = new Date();

        break;

      case 'closed':

        period.closedBy = userId;

        period.closedAt = new Date();

        break;

    }

    await period.save();

    return period;

  }

  /*
  =====================================================
  RECALCULATE TOTALS
  =====================================================
  */

  static async updateStatistics(id) {

    const payrolls =
      await Payroll.find({

        payrollPeriod: id,

      });

    let gross = 0;

    let net = 0;

    let deductions = 0;

    let overtime = 0;

    let processed = 0;

    let approved = 0;

    let paid = 0;

    payrolls.forEach((payroll) => {

      gross +=
        payroll.totals.grossPay || 0;

      net +=
        payroll.totals.netPay || 0;

      deductions +=
        payroll.totals.totalDeductions || 0;

      overtime +=
        payroll.earnings.overtimePay || 0;

      processed++;

      if (
        [
          'approved',
          'locked',
          'paid',
        ].includes(
          payroll.workflow.status
        )
      ) {
        approved++;
      }

      if (
        payroll.workflow.status ===
        'paid'
      ) {
        paid++;
      }

    });

    const period =
      await PayrollPeriod.findById(id);

    if (!period) {
      throw new Error(
        'Payroll period not found.'
      );
    }

    period.totalEmployees =
      payrolls.length;

    period.processedEmployees =
      processed;

    period.approvedEmployees =
      approved;

    period.paidEmployees =
      paid;

    period.totalGrossPay =
      gross;

    period.totalNetPay =
      net;

    period.totalDeductions =
      deductions;

    period.totalOvertime =
      overtime;

    await period.save();

    return period;

  }

}

module.exports = PayrollPeriodService;