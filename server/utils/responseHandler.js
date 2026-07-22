/*
=========================================================
SUCCESS RESPONSE
=========================================================
*/

const successResponse = (
    res,
    statusCode = 200,
    message = 'Success',
    data = null
) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

/*
=========================================================
ERROR RESPONSE
=========================================================
*/

const errorResponse = (
    res,
    error,
    statusCode = 500
) => {

    if (typeof error === 'string') {
        return res.status(statusCode).json({
            success: false,
            message: error,
        });
    }

    return res.status(statusCode).json({
        success: false,
        message:
            error.message ||
            'Something went wrong.',
        errors:
            error.errors || null,
    });

};

/*
=========================================================
BACKWARD COMPATIBILITY
=========================================================
*/

const success = (
    res,
    message = 'Success',
    data = null,
    statusCode = 200
) => successResponse(
    res,
    statusCode,
    message,
    data
);

const error = (
    res,
    message = 'Something went wrong',
    statusCode = 500,
    errors = null
) =>
    res.status(statusCode).json({
        success: false,
        message,
        errors,
    });

module.exports = {

    successResponse,
    errorResponse,

    success,
    error,

};