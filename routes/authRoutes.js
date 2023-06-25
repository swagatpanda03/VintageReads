const router = require('express').Router();
const {requireAuth} = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');
const multer = require('multer');



const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        return cb(null, 'public/uploads');
    },
    filename: function(req, file, cb) {
        return cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({storage});

//Seller's Registration
router.get('/start-selling', authController.startSelling);
router.post('/start-selling', authController.startSellingPost);

router.get('/seller_login', authController.seller_login);
router.post('/seller_login', authController.seller_login_post);
//Customer's Registration
router.get('/myaccount', authController.myaccount);
router.post('/myaccount', authController.myaccountPost);
//Customer Login
router.get('/login', authController.userlogin);
router.post('/login', authController.userloginPost);
router.get('/logout', authController.logout);

router.get('/sell_product', requireAuth, authController.sellproducts);
router.post('/sell_product', upload.single('book_image'),requireAuth, authController.sellproductspost);

router.get('/seller_products/:id', requireAuth, authController.sellerproducts);

router.get('/user_index', requireAuth, authController.userIndex);
router.get('/myprofile/:id', requireAuth, authController.myprofile);
router.post('/myprofile', requireAuth, authController.myprofilePost);
router.get('/books', requireAuth, authController.books);
router.get('/arts', requireAuth, authController.arts);
router.get('/comics', requireAuth, authController.comics);
router.post('/product', requireAuth, authController.product);
router.post('/art', requireAuth, authController.art);
router.post('/comic', requireAuth, authController.comic);
router.get('/myorders/:id', requireAuth, authController.myorders);
router.get('/payment', requireAuth, authController.payment);
router.post('/payment', requireAuth, authController.paymentPost);
router.post('/success', requireAuth, authController.success);

module.exports = router;