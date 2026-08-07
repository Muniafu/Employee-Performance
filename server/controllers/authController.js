const User = require('../models/User');
const Employee = require('../models/Employee');
const crypto = require("crypto");

const {
    sendEmail,
    templates,
} = require("../utils/emailService");
const { signToken } = require('../utils/token');

const sendAuth = (user, code, res) => {
  const token = signToken({
    id: user._id,
    role: user.role,
  });

  const safeUser = user.toObject();

  delete safeUser.password;

  const employee = Employee.findOne({
    user: user._id,
  }).select('_id employeeId department position status');

  res.status(code).json({
    success: true,
    data: {
      token,
      user: {
        ...safeUser,
        hasEmployeeProfile: !!employee,
      },
      employee,
    },
  });
};

const createUserWithEmployee = async ({
  firstName,
  lastName,
  email,
  password,
  role = 'employee',
  status = 'PENDING',
  department = '',
  position = '',
  phone = '',
  salary = 0,
}) => {

  const existing = await User.findOne({ email });

  if (existing) {
    const err = new Error('Email already registered.');
    err.statusCode = 409;
    throw err;
  }
  
  // Bootstrap the system
  const userCount = await User.countDocuments();

  const isFirstuser = userCount === 0;

  const createdUser = await User.create({
    firstName,
    lastName,
    email,
    password,

    role: isFirstuser ? 'superuser' : role,

    status: isFirstuser ? 'APPROVED' : status,

    isSystem: isFirstuser,

    protectedAccount: isFirstuser,
  });

  await Employee.create({
    user: createdUser._id,
    department,
    position,
    phone,
    salary,
  });

  return createdUser;
};

// PUBLIC EMPLOYEE REGISTER
exports.register = async (req, res, next) => {
  try {

    const {
      firstName,
      lastName,
      email,
      password,
      department,
      position,
      phone,
      salary,
    } = req.body;

    const user = await createUserWithEmployee({
      firstName,
      lastName,
      email,
      password,
      department,
      position,
      phone,
      salary,
    });

    user.lastLogin = new Date();

    await user.save({
      validateBeforeSave: false,
    });
    
    // Only automatically login approved users
    if (user.status === 'APPROVED') {
      
      const token = signToken({
        id: user._id,
        role: user.role,
      });

      const safeUser = user.toObject();

      delete safeUser.password;

      return res.status(201).json({
        success: true,
        message: 'System initialized successfully.',
        data: {
          approved: true,
          token,
          user: safeUser,
        },
      });

    }

    return res.status(210).json({
      success: true,
      mesage: 'Registration successful. Your account is awaiting administrator approval.',
      data: {
        approved: false,
      },
      
    });

  } catch (err) {
    next(err);
  }
};

// LOGIN
exports.login = async (req, res, next) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password required.',
      });
    }

    const user = await User
      .findOne({ email })
      .select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account deactivated.',
      });
    }

    if (user.status === 'PENDING') {
      return res.status(403).json({
        success: false,
        message:
          'Your account is pending approval.',
      });
    }

    if (user.status === 'REJECTED') {
      return res.status(403).json({
        success: false,
        message:
          'Your account request was rejected.',
      });
    }

    if (user.status === 'SUSPENDED') {
      return res.status(403).json({
        success: false,
        message:
          'Your account has been suspended.',
      });
    }

    user.lastLogin = new Date();

    await user.save({
      validateBeforeSave: false,
    });

    await sendAuth(user, 200, res);

  } catch (err) {
    next(err);
  }
};

// CURRENT USER
exports.getMe = async (req, res, next) => {
  try {

    if (req.user.status !== 'APPROVED') {
      return res.status(403).json({
        success: false,
        message: 'Account not approved.',
      });
    }

    const employee = await Employee.findOne({
      user: req.user._id,
    });

    res.status(200).json({
      success: true,
      data: {
        user: req.user,
        employee,
      },
    });

  } catch (err) {
    next(err);
  }
};

// ADMIN REGISTER
// ADMIN / HR REGISTER
exports.registerAdmin = async (req, res, next) => {
  try {

    const {
      firstName,
      lastName,
      email,
      password,
      role,
      department,
      position,
      phone,
      salary,
    } = req.body;

    const allowedRoles = [
      'employee',
      'manager',
      'hr',
      'admin',
    ];

    if (
      role &&
      !allowedRoles.includes(role)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role assignment.',
      });
    }

    // Only superuser can create admins
    if (
      role === 'admin' &&
      req.user.role !== 'superuser'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Only superusers can create admin accounts.',
      });
    }

    // Prevent superuser creation through endpoint
    if (role === 'superuser') {
      return res.status(403).json({
        success: false,
        message: 'Superuser accounts cannot be created through this endpoint.',
      });
    }

    const user = await createUserWithEmployee({
      firstName,
      lastName,
      email,
      password,
      role: role || 'manager',
      status: 'APPROVED',
      department,
      position,
      phone,
      salary,
    });

    res.status(201).json({
      success: true,
      message: 'Privileged account created successfully.',
      data: {
        user,
      },
    });

  } catch (err) {
    next(err);
  }
};

// CHANGE PASSWORD
exports.changePassword = async (req, res, next) => {
  try {

    const {
      currentPassword,
      newPassword,
    } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Both passwords required.',
      });
    }

    const user = await User
      .findById(req.user._id)
      .select('+password');

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Current password incorrect.',
      });
    }

    user.password = newPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully.',
    });

  } catch (err) {
    next(err);
  }
};

/*
=========================================================
FORGOT PASSWORD
=========================================================
*/

exports.forgotPassword = async (req, res, next) => {

  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const user = await User
      .findOne({ email })
      .select("+passwordResetToken +passwordResetExpires");

    /**
     * Prevent account enumeration.
     */

    if (!user) {

      return res.status(200).json({
        success: true,
        message:
          "If an account exists for this email, a reset link has been sent.",
      });

    }

    /**
     * Create secure token.
     */

    const resetToken =
      user.createPasswordResetToken();

    await user.save({
      validateBeforeSave: false,
    });

    /**
     * Frontend URL
     */

    const resetURL =
      `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password/${resetToken}`;

    const emailTemplate =
      templates.passwordReset(
        user.fullName,
        resetURL
      );

    const result =
      await sendEmail({

        to: user.email,

        subject:
          emailTemplate.subject,

        html:
          emailTemplate.html,

      });

    /**
     * Email failed.
     */

    if (!result.success) {

      user.clearPasswordReset();

      await user.save({
        validateBeforeSave: false,
      });

      return res.status(500).json({

        success: false,

        message:
          "Unable to send reset email.",

      });

    }

    res.status(200).json({

      success: true,

      message:
        "If an account exists for this email, a reset link has been sent.",

    });

  }

  catch (err) {

    next(err);

  }

};

/*
=========================================================
RESET PASSWORD
=========================================================
*/

exports.resetPassword = async (req, res, next) => {

  try {

    const { token } = req.params;

    const { password } =
      req.body;

    if (!password) {

      return res.status(400).json({

        success: false,

        message:
          "New password is required.",

      });

    }

    /**
     * Hash incoming token.
     */

    const hashedToken =
      crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user =
      await User.findOne({

        passwordResetToken:
          hashedToken,

        passwordResetExpires:
          {
            $gt: Date.now(),
          },

      })
      .select(
        "+passwordResetToken +passwordResetExpires +password"
      );

    if (!user) {

      return res.status(400).json({

        success: false,

        message:
          "Reset link is invalid or has expired.",

      });

    }

    /**
     * Update password.
     */

    user.password =
      password;

    user.clearPasswordReset();

    await user.save();

    /**
     * Auto login.
     */

    user.lastLogin =
      new Date();

    await user.save({
      validateBeforeSave: false,
    });

    sendAuth(
      user,
      200,
      res
    );

  }

  catch (err) {

    next(err);

  }

};