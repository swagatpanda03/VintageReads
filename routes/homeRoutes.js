const router = require('express').Router();

const homeController = require('../controllers/homeController');

router.get('/', homeController.home);
router.get('/contact', homeController.contact);
router.post('/contact', homeController.contactPost);
router.get('/aboutus', homeController.about);
module.exports = router;