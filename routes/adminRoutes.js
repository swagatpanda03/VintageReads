const router = require('express').Router();

const adminController = require('../controllers/adminController');

const {requireAuth} = require('../middleware/authMiddleware');

router.get('/admin/dashboard', requireAuth, adminController.dashboard);
router.get('/admin/customers', requireAuth, adminController.customers);
router.get('/admin/sellers',requireAuth, adminController.sellers);
router.get('/admin/orders',requireAuth, adminController.orders);
router.get('/admin/queries',requireAuth, adminController.queries);
router.get('/admin/login', adminController.login);
router.post('/admin/login', adminController.loginpost);
router.get('/admin/logout', adminController.logout);
router.get('/admin/art',requireAuth, adminController.art);
router.get('/admin/book',requireAuth, adminController.book);
router.get('/admin/comic',requireAuth, adminController.comic);

module.exports = router;