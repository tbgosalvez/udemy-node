const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false
    // formsCSS: true,
    // productCSS: true,
    // activeAddProduct: true
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null, title, imageUrl, description, price);
  product.save();
  res.redirect("/");
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }

  const pid = req.params.pid;
  Product.findById(pid, pp => {
    if (!pp) return res.redirect("/");

    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: pp
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = res.body.productId;
  const updTitle = res.body.title;
  const updPrice = res.body.price;
  const updImgUrl = res.body.imageUrl;
  const updDesc = res.body.description;

  const updatedProduct = new Product(
    prodId,
    updTitle,
    updImgUrl,
    updDesc,
    updPrice
  );
  updatedProduct
    .save()
    .then(res.redirect("/"))
    .catch(e => console.log(e));
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products"
    });
  });
};
