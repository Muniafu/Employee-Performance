const router = require('express').Router();

const auth = require('../middleware/authMiddleware');

const {
  authorize,
} = require('../middleware/roleMiddleware');

const controller = require(
  '../controllers/payrollPeriodController'
);

/*
=====================================================
Authentication
=====================================================
*/

router.use(auth);

/*
=====================================================
Read
=====================================================
*/

router.get(
  '/',
  authorize(
    'admin',
    'superuser',
    'hr'
  ),
  controller.getAllPeriods
);

router.get(
  '/:id',
  authorize(
    'admin',
    'superuser',
    'hr'
  ),
  controller.getPeriod
);

/*
=====================================================
Create
=====================================================
*/

router.post(
  '/',
  authorize(
    'admin',
    'superuser',
    'hr'
  ),
  controller.createPeriod
);

/*
=====================================================
Update
=====================================================
*/

router.put(
  '/:id',
  authorize(
    'admin',
    'superuser',
    'hr'
  ),
  controller.updatePeriod
);

/*
=====================================================
Delete
=====================================================
*/

router.delete(
  '/:id',
  authorize(
    'superuser'
  ),
  controller.deletePeriod
);

/*
=====================================================
Workflow
=====================================================
*/

router.patch(
  '/:id/attendance-lock',
  authorize(
    'admin',
    'superuser',
    'hr'
  ),
  controller.lockAttendance
);

router.patch(
  '/:id/process',
  authorize(
    'admin',
    'superuser',
    'hr'
  ),
  controller.startProcessing
);

router.patch(
  '/:id/approve',
  authorize(
    'admin',
    'superuser'
  ),
  controller.approvePeriod
);

router.patch(
  '/:id/lock',
  authorize(
    'admin',
    'superuser'
  ),
  controller.lockPayroll
);

router.patch(
  '/:id/pay',
  authorize(
    'admin',
    'superuser'
  ),
  controller.markPaid
);

router.patch(
  '/:id/close',
  authorize(
    'admin',
    'superuser'
  ),
  controller.closePeriod
);

module.exports = router;