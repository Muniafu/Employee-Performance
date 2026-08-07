const router = require('express').Router();

const {
  register,
  login,
  getMe,
  changePassword,
  registerAdmin,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');

const auth = require('../middleware/authMiddleware');

const {
  authorize,
} = require('../middleware/roleMiddleware');

const {
  authLimiter,
} = require('../middleware/rateLimiter');

router.post('/register', authLimiter, register);

router.post('/login', authLimiter, login);

router.get('/me', auth, getMe);

router.put('/change-password', auth, changePassword);

router.post(
  '/register-admin',
  auth,
  authorize('admin', 'superuser'),
  registerAdmin
);

router.post(
    "/forgot-password",
    authLimiter,
    forgotPassword
);

router.post(
    "/reset-password/:token",
    authLimiter,
    resetPassword
);

module.exports = router;