const router = require('express').Router();

const auth = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const PayrollController = require('../controllers/payrollController');

router.use(auth);

/*
=====================================================
EMPLOYEE
=====================================================
*/

router.get(
    '/me',
    PayrollController.getMyPayroll
);

/*
=====================================================
PAYROLL GENERATION
=====================================================
*/

router.post(
    '/preview',
    authorize('admin', 'hr', 'superuser'),
    PayrollController.preview
);

router.patch(
    "/:id/reject",
    authorize("admin", "superuser"),
    PayrollController.reject
);

router.post(
    '/generate',
    authorize('admin', 'hr', 'superuser'),
    PayrollController.finalize
);

router.post(
    '/bulk-generate',
    authorize('admin', 'hr', 'superuser'),
    PayrollController.bulkGenerate
);

/*
=====================================================
WORKFLOW
=====================================================
*/

router.patch(
    '/:id/review',
    authorize('admin', 'hr', 'superuser'),
    PayrollController.review
);

router.patch(
    '/:id/approve',
    authorize('admin', 'superuser'),
    PayrollController.approve
);

router.patch(
    '/:id/lock',
    authorize('admin', 'superuser'),
    PayrollController.lock
);

router.patch(
    '/:id/pay',
    authorize('admin', 'superuser'),
    PayrollController.markPaid
);

/*
=====================================================
REPORTS
=====================================================
*/

router.get(
    '/statistics',
    authorize('admin', 'hr', 'superuser'),
    PayrollController.statistics
);

/*
=====================================================
CRUD
=====================================================
*/

router.get(
    '/',
    authorize('admin', 'hr', 'superuser'),
    PayrollController.getAll
);

router.get(
    '/:id',
    authorize('admin', 'hr', 'superuser', 'employee'),
    PayrollController.getOne
);

router.delete(
    '/:id',
    authorize('superuser'),
    PayrollController.remove
);

module.exports = router;