const router = require('express').Router();

const auth = require('../middleware/authMiddleware');

const {
  authorize,
} = require('../middleware/roleMiddleware');

const controller = require(
  '../controllers/payrollSettingsController'
);

router.use(auth);

router.get(
  '/',
  authorize(
    'admin',
    'superuser',
    'hr'
  ),
  controller.getSettings
);

router.post(
  '/',
  authorize(
    'admin',
    'superuser'
  ),
  controller.createSettings
);

router.put(
  '/:id',
  authorize(
    'admin',
    'superuser'
  ),
  controller.updateSettings
);

router.patch(
  '/:id/activate',
  authorize(
    'admin',
    'superuser'
  ),
  controller.activateSettings
);

router.patch(
  '/:id/deactivate',
  authorize(
    'admin',
    'superuser'
  ),
  controller.deactivateSettings
);

router.delete(
  '/:id',
  authorize('superuser'),
  controller.deleteSettings
);

module.exports = router;