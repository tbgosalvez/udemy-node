const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

const authController = require('../middleware/getAuth');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', authController, shopController.getCart);

router.post('/cart', authController, shopController.postCart);

router.post('/cart-delete-item', authController, shopController.postCartDeleteProduct);

router.post('/create-order', authController, shopController.postOrder);

router.get('/orders', authController, shopController.getOrders);

module.exports = router;
