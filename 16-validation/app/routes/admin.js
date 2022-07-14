const path = require("path");

const express = require("express");

const { body } = require("express-validator");

const adminController = require("../controllers/admin");

const sessionController = require("../middleware/getAuth");

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", sessionController, adminController.getAddProduct);

// /admin/products => GET
router.get("/products", sessionController, adminController.getProducts);

// /admin/add-product => POST
router.post(
  "/add-product",
  sessionController,
  body("title")
    .isString()
    .withMessage("special characters are not allowed for the title."),
  // body("imageURL")
  //   .isURL()
  //   .withMessage("please enter a valid URL for the image."),
  body("price")
    .isFloat()
    .withMessage("please use a numeric monetary format for the price."),
  body("description")
    .isLength({ max: 255 })
    .withMessage("max 255 characters for the description."),
  adminController.postAddProduct
);

router.get(
  "/edit-product/:productId",
  sessionController,
  adminController.getEditProduct
);

router.post(
  "/edit-product",
  sessionController,
  body("title")
    .isAlphanumeric()
    .withMessage("special characters are not allowed for the title."),
  body("imageURL")
    .isURL()
    .withMessage("please enter a valid URL for the image."),
  body("price")
    .isFloat()
    .withMessage("please use a numeric monetary format for the price."),
  body("description")
    .isLength({ max: 255 })
    .withMessage("max 255 characters for the description."),
  adminController.postEditProduct
);

router.post(
  "/delete-product",
  sessionController,
  adminController.postDeleteProduct
);

module.exports = router;
