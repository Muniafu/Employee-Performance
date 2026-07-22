const mongoose = require('mongoose');
const {
    PAYROLL_STATUS,
    PAYMENT_STATUS,
    PAYMENT_METHOD,
} = require('../constants/payrollConstants');

const auditSchema = new mongoose.Schema(
{
    action:{
        type:String,
        required:true,
        trim:true,
    },

    performedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },

    remarks:{
        type:String,
        default:'',
        trim:true,
    },

    timestamp:{
        type:Date,
        default:Date.now,
    }

},
{
    _id:false,
}
);

const allowanceBreakdownSchema = new mongoose.Schema(
{
    housing:{
        type:Number,
        default:0,
        min:0,
    },

    transport:{
        type:Number,
        default:0,
        min:0,
    },

    medical:{
        type:Number,
        default:0,
        min:0,
    },

    communication:{
        type:Number,
        default:0,
        min:0,
    },

    hardship:{
        type:Number,
        default:0,
        min:0,
    },

    other:{
        type:Number,
        default:0,
        min:0,
    },
},
{
    _id:false,
}
);

const deductionBreakdownSchema = new mongoose.Schema(
{
    loan:{
        type:Number,
        default:0,
        min:0,
    },

    insurance:{
        type:Number,
        default:0,
        min:0,
    },

    pension:{
        type:Number,
        default:0,
        min:0,
    },

    savings:{
        type:Number,
        default:0,
        min:0,
    },

    other:{
        type:Number,
        default:0,
        min:0,
    },
},
{
    _id:false,
}
);

const payrollSchema = new mongoose.Schema(
{

    employee:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Employee',
        required:true,
        index:true,
    },

    payrollPeriod:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'PayrollPeriod',
        required:true,
        index:true,
    },

    /*
    =====================================================
    IMMUTABLE EMPLOYEE SNAPSHOT
    =====================================================
    */

    employeeSnapshot:{

        employeeId:{
            type:String,
            required:true,
        },
        firstName:String,
        lastName:String,
        email:String,
        department:String,
        designation:String,
        employmentType:String,

        currency:{
            type:String,
            default:'KES',
        },

        salary:{
            basic: Number,
            dailyRate: Number,
            hourlyRate: Number,
            payFrequency: String,
        },

        bankDetails:{
            bankName:String,
            accountNumber:String,
            branchCode:String,
        },

        statutory:{
            taxPin:String,
            nhifNumber:String,
            nssfNumber:String,
        },

        allowances:{
            type:allowanceBreakdownSchema,
            default:() => ({}),
        },

        deductions:{
            type:deductionBreakdownSchema,
            default:() => ({}),
        },

    },

    /*
    =====================================================
    ATTENDANCE SUMMARY
    =====================================================
    */

    attendanceSummary:{

        workingDays:{
            type:Number,
            default:0,
        },

        daysWorked:{
            type:Number,
            default:0,
        },

        paidLeaveDays:{
            type:Number,
            default:0,
        },

        unpaidLeaveDays:{
            type:Number,
            default:0,
        },

        absentDays:{
            type:Number,
            default:0,
        },

        overtimeHours:{
            type:Number,
            default:0,
        },

        lateMinutes:{
            type:Number,
            default:0,
        },

        workingHours:{
            type:Number,
            default:0,
        },    },

    /*
    =====================================================
    EARNINGS
    =====================================================
    */

    earnings:{

        basicSalary:{
            type:Number,
            default:0,
        },

        overtimePay:{
            type:Number,
            default:0,
        },

        allowances:{
            type:allowanceBreakdownSchema,
            default:() => ({}),
        },

        bonuses:{
            type:Number,
            default:0,
        },

        commissions:{
            type:Number,
            default:0,
        },

        reimbursements:{
            type:Number,
            default:0,
        },

        grossPay:{
            type:Number,
            default:0,
        },

        taxableAllowances:{
            type:Number,
            default:0,
        },

        nonTaxableAllowances:{
            type:Number,
            default:0,
        },

    },

    /*
    =====================================================
    STATUTORY DEDUCTIONS
    =====================================================
    */

    statutory:{

        paye:{
            type:Number,
            default:0,
        },

        nhif:{
            type:Number,
            default:0,
        },

        nssf:{
            type:Number,
            default:0,
        },

        housingLevy:{
            type:Number,
            default:0,
        },

        employerCost:{
            type:Number,
            default:0,
        },

    },

    /*
    =====================================================
    EMPLOYEE DEDUCTIONS
    =====================================================
    */

    deductions:{

        loan:{
            type:Number,
            default:0,
        },

        insurance:{
            type:Number,
            default:0,
        },

        pension:{
            type:Number,
            default:0,
        },

        savings:{
            type:Number,
            default:0,
        },

        other:{
            type:Number,
            default:0,
        },

    },

    /*
    =====================================================
    TOTALS
    =====================================================
    */

    totals:{

        taxableIncome:{
            type:Number,
            default:0,
        },

        totalAllowances:{
            type:Number,
            default:0,
        },

        totalStatutory:{
            type:Number,
            default:0,
        },

        totalEmployeeDeductions:{
            type:Number,
            default:0,
        },

        totalEmployerContributions:{
            type:Number,
            default:0,
        },

        totalDeductions:{
            type:Number,
            default:0,
        },

        grossPay:{
            type:Number,
            default:0,
        },

        netPay:{
            type:Number,
            default:0,
        },

    },

    /*
    =====================================================
    WORKFLOW
    =====================================================
    */

    workflow:{

        status:{
            type:String,
            enum:Object.values(PAYROLL_STATUS),
            default:PAYROLL_STATUS.DRAFT,
        },

        generatedBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
        },

        generatedAt:Date,

        reviewedBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
        },

        reviewedAt:Date,

        approvedBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
        },

        approvedAt:Date,

        lockedBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
        },

        lockedAt:Date,

        lastModifiedAt:{
            type:Date,
        },

    },

    /*
    =====================================================
    PAYMENT
    =====================================================
    */

    payment:{

        paymentStatus:{
            type:String,
            enum:Object.values(PAYMENT_STATUS),
            default:PAYMENT_STATUS.PENDING,
        },

        paymentMethod:{
            type:String,
            enum:Object.values(PAYMENT_METHOD),
        },
        paymentReference:String,
        paymentDate:Date,

        bankReference:String,
        
        transactionId:String,
    },

    /*
    =====================================================
    PAYSLIP
    =====================================================
    */

    payslip:{

        generated:{
            type:Boolean,
            default:false,
        },

        generatedAt:Date,

        downloadUrl:String,

    },

    /*
    =====================================================
    AUDIT HISTORY
    =====================================================
    */

    auditTrail:{
        type:[auditSchema],
        default:[],
    },

    /*
    =====================================================
    METADATA
    =====================================================
    */

    metadata:{

        notes:{
            type:String,
            default:'',
        },

        version:{
            type:Number,
            default:1,
        },

        generatedByEngine:{
            type: String,
            default: 'PayrollEngine v1',
        },
    },

},
{
    timestamps:true,
}
);

/*
=====================================================
ONE PAYROLL PER EMPLOYEE PER PERIOD
=====================================================
*/

payrollSchema.index(
{
    employee:1,
    payrollPeriod:1,
},
{
    unique:true,
}
);

/*
=====================================================
INDEXES
=====================================================
*/

payrollSchema.index({
    'workflow.status':1,
});

payrollSchema.index({
    'payment.paymentStatus':1,
});

payrollSchema.index({
    'workflow.status':1,
    employee:1,
});

module.exports = mongoose.model( 'Payroll', payrollSchema );