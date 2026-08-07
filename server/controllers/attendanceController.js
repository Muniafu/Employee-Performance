const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');
const Leave = require('../models/Leave');

const syncEmployeeLeaveStatus = require(
    '../utils/syncEmployeeLeaveStatus'
);

const { getIO } = require('../socket/socketManager');

/**
 * ============================================================
 * KENYA TIMEZONE HELPERS
 * ============================================================
 *
 * Attendance dates are stored as a normalized Date representing
 * midnight at the beginning of the Kenya workday.
 *
 * All attendance queries use:
 *
 *     date >= dayStart
 *     date <  dayEnd
 *
 * Never use $regex against Attendance.date because date is a
 * MongoDB Date field.
 */

/**
 * Returns the Kenya calendar date as YYYY-MM-DD.
 */
const getKenyaDate = (date = new Date()) => {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Africa/Nairobi',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(date);
};

/**
 * Returns the start and end of the current Kenya calendar day.
 *
 * Example:
 *
 * Kenya:
 *   2026-08-07 00:00:00
 *   2026-08-08 00:00:00
 *
 * MongoDB stores these as UTC instants internally.
 */
const getKenyaDayBounds = (date = new Date()) => {
    const kenyaDate = getKenyaDate(date);

    const start = new Date(
        `${kenyaDate}T00:00:00+03:00`
    );

    const [year, month, day] =
        kenyaDate.split('-').map(Number);

    const nextDay = new Date(
        Date.UTC(year, month - 1, day + 1)
    );

    const nextDayDate = nextDay
        .toISOString()
        .slice(0, 10);

    const end = new Date(
        `${nextDayDate}T00:00:00+03:00`
    );

    return {
        kenyaDate,
        start,
        end,
    };
};

/**
 * Returns the start/end boundaries for a particular month
 * using Kenya time.
 */
const getKenyaMonthBounds = (year, month) => {
    const start = new Date(
        `${year}-${String(month).padStart(2, '0')}-01T00:00:00+03:00`
    );

    const nextYear =
        month === 12 ? year + 1 : year;

    const nextMonth =
        month === 12 ? 1 : month + 1;

    const end = new Date(
        `${nextYear}-${String(nextMonth).padStart(2, '0')}-01T00:00:00+03:00`
    );

    return {
        start,
        end,
    };
};

/**
 * Calculates how many minutes late an employee is.
 *
 * Standard work start:
 * 08:00 AM Kenya time.
 */
const calculateLateMinutes = (
    dayStart,
    now = new Date()
) => {
    const workStart = new Date(
        dayStart.getTime()
    );

    /*
     * dayStart represents:
     * 00:00 Kenya time = 21:00 UTC previous day.
     *
     * Add 8 hours to reach 08:00 Kenya time.
     */
    workStart.setTime(
        workStart.getTime() +
        8 * 60 * 60 * 1000
    );

    if (now <= workStart) {
        return 0;
    }

    return Math.floor(
        (now.getTime() - workStart.getTime()) /
            (60 * 1000)
    );
};

/**
 * Safely emit attendance updates.
 *
 * Socket failures must never cause an attendance
 * request to fail.
 */
const emitAttendanceUpdate = (employeeId) => {
    try {
        const io = getIO();

        if (io) {
            io.emit('attendance:update', {
                employee: employeeId,
            });
        }
    } catch (error) {
        // Socket errors must not break attendance operations.
    }
};

/**
 * Checks whether an employee has an approved leave
 * covering the current Kenya calendar day.
 */
const isEmployeeOnApprovedLeave = async (
    employeeId
) => {
    const today = getKenyaDate();

    const leaves = await Leave.find({
        employee: employeeId,
        status: 'approved',
    }).lean();

    if (!leaves.length) {
        return null;
    }

    for (const leave of leaves) {
        if (!leave.startDate || !leave.endDate) {
            continue;
        }

        const start = new Date(
            leave.startDate
        ).toLocaleDateString('en-CA', {
            timeZone: 'Africa/Nairobi',
        });

        const end = new Date(
            leave.endDate
        ).toLocaleDateString('en-CA', {
            timeZone: 'Africa/Nairobi',
        });

        if (
            today >= start &&
            today <= end
        ) {
            return leave;
        }
    }

    return null;
};

/**
 * ============================================================
 * CLOCK IN
 * ============================================================
 *
 * POST /api/attendance/clock-in
 */
exports.clockIn = async (req, res, next) => {
    try {
        const employee = req.employee;

        if (!employee?._id) {
            return res.status(404).json({
                success: false,
                message:
                    'Employee profile not found.',
            });
        }

        /*
         * Synchronize employee leave status first.
         */
        await syncEmployeeLeaveStatus(
            employee._id
        );

        /*
         * Do not allow attendance while on approved leave.
         */
        const activeLeave =
            await isEmployeeOnApprovedLeave(
                employee._id
            );

        if (activeLeave) {
            const {
                start: dayStart,
            } = getKenyaDayBounds();

            /*
             * Create an on-leave attendance record
             * only if one does not already exist.
             */
            await Attendance.updateOne(
                {
                    employee: employee._id,
                    date: dayStart,
                },
                {
                    $setOnInsert: {
                        employee: employee._id,
                        date: dayStart,
                        status: 'on_leave',
                    },
                },
                {
                    upsert: true,
                }
            );

            emitAttendanceUpdate(
                employee._id
            );

            return res.status(403).json({
                success: false,
                code: 'EMPLOYEE_ON_LEAVE',
                message:
                    'Clock in unavailable during approved leave.',
                leave: activeLeave,
            });
        }

        const {
            start: dayStart,
            end: dayEnd,
        } = getKenyaDayBounds();

        /*
         * Find today's attendance using a Date range.
         *
         * DO NOT use:
         *
         * date: getKenyaDate()
         *
         * and never use $regex against date.
         */
        const existing =
            await Attendance.findOne({
                employee: employee._id,
                date: {
                    $gte: dayStart,
                    $lt: dayEnd,
                },
            });

        /*
         * Employee has already clocked in.
         */
        if (existing?.clockIn) {
            return res.status(409).json({
                success: false,
                code: 'ALREADY_CLOCKED_IN',
                message:
                    'Attendance already recorded for today.',
                data: existing,
            });
        }

        const now = new Date();

        const lateMinutes =
            calculateLateMinutes(
                dayStart,
                now
            );

        /*
         * If an attendance record exists without
         * clockIn (for example an automatically created
         * absent/on-leave record), update it.
         *
         * Otherwise create a new record.
         */
        let attendance;

        if (existing) {
            existing.clockIn = now;
            existing.status = 'present';
            existing.lateMinutes =
                lateMinutes;

            if (req.body.location) {
                existing.location =
                    req.body.location;
            }

            if (req.body.note !== undefined) {
                existing.note =
                    req.body.note;
            }

            await existing.save();

            attendance = existing;
        } else {
            attendance =
                await Attendance.create({
                    employee: employee._id,
                    date: dayStart,
                    clockIn: now,
                    status: 'present',
                    lateMinutes,
                    location:
                        req.body.location ||
                        'office',
                    note:
                        req.body.note || '',
                });
        }

        emitAttendanceUpdate(
            employee._id
        );

        return res.status(201).json({
            success: true,
            message:
                'Clocked in successfully.',
            data: attendance,
        });
    } catch (err) {
        /*
         * MongoDB unique-index race protection.
         *
         * If two clock-in requests arrive at almost
         * exactly the same time, return 409 rather than
         * exposing a raw database error.
         */
        if (err?.code === 11000) {
            return res.status(409).json({
                success: false,
                code: 'ALREADY_CLOCKED_IN',
                message:
                    'Attendance has already been recorded for today.',
            });
        }

        next(err);
    }
};

/**
 * ============================================================
 * CLOCK OUT
 * ============================================================
 *
 * POST /api/attendance/clock-out
 */
exports.clockOut = async (req, res, next) => {
    try {
        const employee = req.employee;

        if (!employee?._id) {
            return res.status(404).json({
                success: false,
                message:
                    'Employee profile not found.',
            });
        }

        await syncEmployeeLeaveStatus(
            employee._id
        );

        const activeLeave =
            await isEmployeeOnApprovedLeave(
                employee._id
            );

        if (activeLeave) {
            return res.status(403).json({
                success: false,
                code: 'EMPLOYEE_ON_LEAVE',
                message:
                    'Clock out disabled during approved leave.',
                leave: activeLeave,
            });
        }

        const {
            start: dayStart,
            end: dayEnd,
        } = getKenyaDayBounds();

        const attendance =
            await Attendance.findOne({
                employee: employee._id,
                date: {
                    $gte: dayStart,
                    $lt: dayEnd,
                },
            });

        if (
            !attendance ||
            !attendance.clockIn
        ) {
            return res.status(400).json({
                success: false,
                code: 'NOT_CLOCKED_IN',
                message:
                    'Clock in first before clocking out.',
            });
        }

        if (attendance.clockOut) {
            return res.status(409).json({
                success: false,
                code: 'ALREADY_CLOCKED_OUT',
                message:
                    'Already clocked out today.',
                data: attendance,
            });
        }

        attendance.clockOut =
            new Date();

        attendance.calculateHours();

        if (req.body.note !== undefined) {
            attendance.note =
                req.body.note;
        }

        await attendance.save();

        emitAttendanceUpdate(
            employee._id
        );

        return res.status(200).json({
            success: true,
            message:
                `Clocked out successfully. Total hours: ${attendance.hoursWorked}`,
            data: attendance,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * ============================================================
 * GET MY ATTENDANCE
 * ============================================================
 *
 * GET /api/attendance/me
 *
 * Returns attendance belonging ONLY to the authenticated
 * employee.
 */
exports.getMyAttendance = async (
    req,
    res,
    next
) => {
    try {
        const employee = req.employee;

        if (!employee?._id) {
            return res.status(404).json({
                success: false,
                message:
                    'Employee profile not found.',
            });
        }

        const now = new Date();

        const year =
            Number(req.query.year) ||
            Number(
                new Intl.DateTimeFormat(
                    'en-US',
                    {
                        timeZone:
                            'Africa/Nairobi',
                        year: 'numeric',
                    }
                ).format(now)
            );

        const month =
            Number(req.query.month) ||
            Number(
                new Intl.DateTimeFormat(
                    'en-US',
                    {
                        timeZone:
                            'Africa/Nairobi',
                        month: 'numeric',
                    }
                ).format(now)
            );

        if (
            !Number.isInteger(year) ||
            year < 2000 ||
            year > 2100
        ) {
            return res.status(400).json({
                success: false,
                message: 'Invalid year.',
            });
        }

        if (
            !Number.isInteger(month) ||
            month < 1 ||
            month > 12
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'Month must be between 1 and 12.',
            });
        }

        const {
            start,
            end,
        } = getKenyaMonthBounds(
            year,
            month
        );

        /*
         * IMPORTANT:
         *
         * Attendance.date is a Date.
         *
         * Query with $gte/$lt.
         *
         * NEVER use:
         *
         * date: { $regex: ... }
         */
        const records =
            await Attendance.find({
                employee: employee._id,
                date: {
                    $gte: start,
                    $lt: end,
                },
            })
                .sort({
                    date: -1,
                })
                .lean();

        const summary = {
            present: records.filter(
                record =>
                    record.status ===
                    'present'
            ).length,

            absent: records.filter(
                record =>
                    record.status ===
                    'absent'
            ).length,

            onLeave: records.filter(
                record =>
                    record.status ===
                    'on_leave'
            ).length,

            late: records.filter(
                record =>
                    (record.lateMinutes || 0) >
                    0
            ).length,

            totalHours: Number(
                records
                    .reduce(
                        (
                            sum,
                            record
                        ) =>
                            sum +
                            (record.hoursWorked ||
                                0),
                        0
                    )
                    .toFixed(2)
            ),

            overtime: Number(
                records
                    .reduce(
                        (
                            sum,
                            record
                        ) =>
                            sum +
                            (record.overtimeHours ||
                                0),
                        0
                    )
                    .toFixed(2)
            ),
        };

        return res.status(200).json({
            success: true,
            period:
                `${year}-${String(month).padStart(2, '0')}`,
            summary,
            count: records.length,
            data: records,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * ============================================================
 * GET TODAY'S ATTENDANCE
 * ============================================================
 *
 * GET /api/attendance/today
 */
exports.getToday = async (
    req,
    res,
    next
) => {
    try {
        const employee = req.employee;

        if (!employee?._id) {
            return res.status(404).json({
                success: false,
                message:
                    'Employee profile not found.',
            });
        }

        await syncEmployeeLeaveStatus(
            employee._id
        );

        const {
            start: dayStart,
            end: dayEnd,
        } = getKenyaDayBounds();

        const leave =
            await isEmployeeOnApprovedLeave(
                employee._id
            );

        if (leave) {
            return res.status(200).json({
                success: true,
                onLeave: true,
                leave,
                data: {
                    status: 'on_leave',
                },
                message:
                    'Employee currently on approved leave.',
            });
        }

        const record =
            await Attendance.findOne({
                employee: employee._id,
                date: {
                    $gte: dayStart,
                    $lt: dayEnd,
                },
            });

        let message =
            'Not clocked in yet.';

        if (record?.clockOut) {
            message =
                'Workday completed.';
        } else if (record?.clockIn) {
            message =
                'Currently clocked in.';
        }

        return res.status(200).json({
            success: true,
            data: record || null,
            message,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * ============================================================
 * GET ALL ATTENDANCE
 * ============================================================
 *
 * GET /api/attendance/all
 *
 * Intended for HR/Admin/Manager reporting.
 */
exports.getAll = async (
    req,
    res,
    next
) => {
    try {
        const {
            date,
            department,
        } = req.query;

        const filter = {};

        /*
         * If a date is provided, interpret it as a
         * Kenya calendar date and query using a Date range.
         *
         * Example:
         *
         * ?date=2026-08-07
         */
        if (date) {
            const parsedDate =
                /^\d{4}-\d{2}-\d{2}$/.test(
                    date
                );

            if (!parsedDate) {
                return res.status(400).json({
                    success: false,
                    message:
                        'Date must use YYYY-MM-DD format.',
                });
            }

            const start = new Date(
                `${date}T00:00:00+03:00`
            );

            const [year, month, day] =
                date.split('-').map(Number);

            const nextDay =
                new Date(
                    Date.UTC(
                        year,
                        month - 1,
                        day + 1
                    )
                );

            const nextDayDate =
                nextDay
                    .toISOString()
                    .slice(0, 10);

            const end = new Date(
                `${nextDayDate}T00:00:00+03:00`
            );

            filter.date = {
                $gte: start,
                $lt: end,
            };
        }

        /*
         * Department filtering.
         */
        if (department) {
            const employees =
                await Employee.find({
                    department: {
                        $regex:
                            department,
                        $options: 'i',
                    },
                }).select('_id');

            filter.employee = {
                $in: employees.map(
                    employee =>
                        employee._id
                ),
            };
        }

        const records =
            await Attendance.find(filter)
                .populate({
                    path: 'employee',
                    select:
                        'employeeId department position user',
                    populate: {
                        path: 'user',
                        select:
                            'firstName lastName email role',
                    },
                })
                .sort({
                    date: -1,
                })
                .limit(200)
                .lean();

        return res.status(200).json({
            success: true,
            count: records.length,
            data: records,
        });
    } catch (err) {
        next(err);
    }
};
