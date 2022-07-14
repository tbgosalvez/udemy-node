const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products"
      });
    })
    .catch(e => console.log(e));
};

exports.getProduct = (req, res, next) => {
  // name (key) of this param is defined in the route using expressJS
  const pid = req.params.productId;
  Product.findById(pid)
    .then(([data,fieldData]) => {
      console.log(data);
  
      res.render("shop/product-detail", {
        product: data[0],
        pageTitle: data[0].title,
        path: "/product"
      });
    })
    .catch(e => console.log(e));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("shop/product-list", {
        prods: rows,
        pageTitle: "All Products",
        path: "/products"
      });
    })
    .catch(e => console.log(e));
};

exports.getCart = (req, res, next) => {
  res.render("shop/cart", {
    path: "/cart",
    pageTitle: "Your Cart"
  });
};

exports.postCart = (req, res, next) => {
  const pid = req.body.productId;
  console.log(pid);
  Product.findById(pid, product => {
    Cart.addProduct(pid, product.price);
  });
  res.redirect("/cart");
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders"
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout"
  });
};
