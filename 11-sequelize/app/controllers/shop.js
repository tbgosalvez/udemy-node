const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(productList => {
      res.render("shop/product-list", {
        prods: productList,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  // findAll with 'where' condition
  // Product.findAll({where: {id: prodId}})
  //   .then(productList => {
  //     res.render("shop/product-detail", {
  //       product: productList[0],
  //       pageTitle: productList[0].title,
  //       path: "/products",
  //     })
  //   })
  //   .catch(err => console.log(err));

  // find directly by primary key (id)
  Product.findByPk(prodId)
    .then(product => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch(err => console.log(err));
};

// index page/homepage
exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then(productList => {
      res.render("shop/index", {
        prods: productList,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(cart => {
      return cart
        .getProducts()
        .then(prods => {
          res.render("shop/cart", {
            path: "/cart",
            pageTitle: "Your Cart",
            products: prods,
          });
        })
        .catch(e => console.log(e));
    })
    .catch(e => console.log(e));
};

// update cart quantities
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQty = 1;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      let prod;
      if (products.length > 0) prod = products[0];
      if (prod) {
        const oldQty = prod.cartItem.qty;
        newQty = oldQty + 1;
        return prod;
      }

      return Product.findByPk(prodId);
    })
    .then(product => {
      return fetchedCart.addProduct(product, { through: { qty: newQty } });
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch(e => console.log(e));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({where: {id: prodId}});
    })
    .then(products => {
      const prod = products[0];
      return prod.cartItem.destroy();
    })
    .then(result => {
      res.redirect("/cart");
    })
    .catch(e => console.log(e));
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
