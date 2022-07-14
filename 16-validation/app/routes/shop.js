const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

const sessionController = require('../middleware/getAuth');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', sessionController, shopController.getCart);

router.post('/cart', sessionController, shopController.postCart);

router.post('/cart-delete-item', sessionController, shopController.postCartDeleteProduct);

router.post('/create-order', sessionController, shopController.postOrder);

router.get('/orders', sessionController, shopController.getOrders);

module.exports = router;
