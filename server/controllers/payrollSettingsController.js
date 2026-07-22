const PayrollSettings = require('../models/PayrollSettings');

const {
  successResponse,
  errorResponse,
} = require('../utils/responseHandler');

/*
==========================================================
GET ACTIVE SETTINGS
==========================================================
*/

const getSettings = async (req, res) => {
  try {
    const settings = await PayrollSettings.findOne({
      active: true,
    });

    if (!settings) {
      return errorResponse(
        res,
        'Payroll settings not found.',
        404
      );
    }

    return successResponse(
      res,
      200,
      'Payroll settings retrieved successfully.',
      settings
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

/*
==========================================================
CREATE SETTINGS
==========================================================
*/

const createSettings = async (req, res) => {
  try {
    const existing = await PayrollSettings.findOne({
      companyCode: req.body.companyCode,
    });

    if (existing) {
      return errorResponse(
        res,
        'Payroll settings already exist for this company.',
        409
      );
    }

    const settings = await PayrollSettings.create({
      ...req.body,
      createdBy: req.user.id,
      updatedBy: req.user.id,
    });

    return successResponse(
      res,
      201,
      'Payroll settings created successfully.',
      settings
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

/*
==========================================================
UPDATE SETTINGS
==========================================================
*/

const updateSettings = async (req, res) => {
  try {
    const settings = await PayrollSettings.findById(
      req.params.id
    );

    if (!settings) {
      return errorResponse(
        res,
        'Payroll settings not found.',
        404
      );
    }

    Object.assign(settings, req.body);

    settings.updatedBy = req.user.id;

    await settings.save();

    return successResponse(
      res,
      200,
      'Payroll settings updated successfully.',
      settings
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

/*
==========================================================
ACTIVATE SETTINGS
==========================================================
*/

const activateSettings = async (req, res) => {
  try {
    const settings = await PayrollSettings.findById(
      req.params.id
    );

    if (!settings) {
      return errorResponse(
        res,
        'Payroll settings not found.',
        404
      );
    }

    await PayrollSettings.updateMany(
      {},
      {
        active: false,
      }
    );

    settings.active = true;
    settings.updatedBy = req.user.id;

    await settings.save();

    return successResponse(
      res,
      200,
      'Payroll settings activated successfully.',
      settings
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

/*
==========================================================
DEACTIVATE SETTINGS
==========================================================
*/

const deactivateSettings = async (req, res) => {
  try {
    const settings = await PayrollSettings.findById(
      req.params.id
    );

    if (!settings) {
      return errorResponse(
        res,
        'Payroll settings not found.',
        404
      );
    }

    settings.active = false;
    settings.updatedBy = req.user.id;

    await settings.save();

    return successResponse(
      res,
      200,
      'Payroll settings deactivated successfully.',
      settings
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

/*
==========================================================
DELETE SETTINGS
==========================================================
*/

const deleteSettings = async (req, res) => {
  try {
    const settings =
      await PayrollSettings.findByIdAndDelete(
        req.params.id
      );

    if (!settings) {
      return errorResponse(
        res,
        'Payroll settings not found.',
        404
      );
    }

    return successResponse(
      res,
      200,
      'Payroll settings deleted successfully.'
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

module.exports = {
  getSettings,
  createSettings,
  updateSettings,
  activateSettings,
  deactivateSettings,
  deleteSettings,
};