const express = require('express');

const shopController = require('../controllers/shop');
const router = express.Router();
router.get('/',shopController.getIndex);
router.get('/products/:category',shopController.getProductCategorywise);
router.get('/product/:productId',shopController.getSingleProduct);
router.get('/cart',shopController.getCart);
router.post('/addtocart',shopController.postCart);
router.get('/addproduct',shopController.getaddproduct);
router.post('/postaddproduct',shopController.postaddproduct);
router.get('/getproducts',shopController.getallproductadmin);
router.get('/edit-product/:productId',shopController.geteditproduct);
router.post('/edit-product',shopController.posteditproduct);
router.post('/deleteproduct',shopController.deleteproduct);
router.post('/postdeletecart',shopController.deletecart);
module.exports = router;