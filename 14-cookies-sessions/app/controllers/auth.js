const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  // console.log(req.get("Cookie"));
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isLoggedIn: req.session.isLoggedIn // can also use req.session.user
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("5eda9bef64d3612995597ad9")
  .then(user => {
    req.session.user = user;
    req.session.isLoggedIn = true;

    // make sure the db stuff finishes before redirecting
    req.session.save(err => {
      // or put in another then() block?
      res.redirect("/");
    });

  })
  .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
};