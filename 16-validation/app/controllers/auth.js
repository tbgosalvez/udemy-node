const bcrypt = require("bcryptjs");
const User = require("../models/user");

const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");

const { validationResult } = require("express-validator/check");

const transporter = nodemailer.createTransport(
  sgTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

exports.getLogin = (req, res, next) => {
  let msg = req.flash("error");
  if (msg.length > 0) {
    msg = msg[0];
  } else {
    msg = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMsg: msg,
    oldInput: { email: "", password: "", confirmPassword: "" },
    validationErrors: [],

  });
};

exports.getSignup = (req, res, next) => {
  let msg = req.flash("error");
  if (msg.length > 0) {
    msg = msg[0];
  } else {
    msg = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMsg: msg,
    oldInput: { email: "", password: "", confirmPassword: "" },
    validationErrors: [],
  });
};

exports.postLogin = (req, res, next) => {
  const em = req.body.email;
  const pwd = req.body.password;
  const errors = validationResult(req);

  // re-render and display field validation errors
  if (!errors.isEmpty()) {
    console.log(errors);

    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Log In",
      errorMsg: errors.array()[0].msg,
      oldInput: { email: em, password: pwd },
      validationErrors: errors.array(),
    });
  }

  // query db
  User.findOne({ email: em })
    .then(user => {
      if (!user) {
        return res.status(422).render("auth/login", {
          path: "/login",
          pageTitle: "Log In",
          errorMsg: "Invalid email and/or password.",
          oldInput: { email: em, password: pwd },
          validationErrors: [], // don't reveal which one was wrong
        });
      }

      // Set session and go to home page
      bcrypt.compare(pwd, user.password).then(doesMatch => {
        if (doesMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;

          return req.session.save(err => {
            console.log(err);
            res.redirect("/");
          });
        }

        // wrong password
        return res.status(422).render("auth/login", {
          path: "/login",
          pageTitle: "Log In",
          errorMsg: "Invalid email and/or password.",
          oldInput: { email: em, password: pwd },
          validationErrors: [], // don't reveal which one was wrong
        });
      });
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const pwd = req.body.password;
  const errors = validationResult(req);

  // re-render and display field validation errors
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMsg: errors.array()[0].msg,
      oldInput: { email: email, password: pwd, confirmPassword: req.body.confirmPassword },
      validationErrors: errors.array(),
    });
  }

  // create a hashed password, create a user
  bcrypt
    .hash(pwd, 12)
    .then(hashedPwd => {
      const user = new User({
        email: email,
        password: hashedPwd,
        cart: { items: [] },
      });

      return user.save();
    })
    .then(result => {
      res.redirect("/login");

      return transporter.sendMail({
        to: email,
        from: "tbgosalvez@protonmail.com",
        subject: "Node Shop|Signup Successful!",
        html:
          "<h2>You have successfully signed up for Brian's Node.js shop!</h2>",
      });
    })
    .catch(e => {
      console.log(e);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect("/");
  });
};
