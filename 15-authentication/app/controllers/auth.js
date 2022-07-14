const bcrypt = require("bcryptjs");
const User = require("../models/user");

const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');


const transporter = nodemailer.createTransport(sgTransport({
  auth: {
    api_key: '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'
  }
}));


exports.getLogin = (req, res, next) => {
  let msg = req.flash('error');
  if(msg.length > 0) {
    msg = msg[0];
  }
  else {
    msg = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMsg: msg
  });
};

exports.getSignup = (req, res, next) => {
  let msg = req.flash('error');
  if(msg.length > 0) {
    msg = msg[0];
  }
  else {
    msg = null;
  }
    res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMsg: msg
    
  });
};

exports.postLogin = (req, res, next) => {
  const em = req.body.email;
  const pwd = req.body.password;

  User.findOne({ email: em })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email and/or password.');
        return res.redirect("/login");
      }

      bcrypt.compare(pwd, user.password).then(doesMatch => {
        if (doesMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          
          return req.session.save(err => {
            console.log(err);
            res.redirect("/");
          });
        }

        req.flash('error', 'Invalid email and/or password.');
        res.redirect("/login");
      });
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const pwd = req.body.password;
  const confirmPwd = req.body.confirmPassword;

  User.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        console.log("email exists: \n" + userDoc);

        req.flash('error', 'Email already exists.');

        return res.redirect("/signup");
      }

      return bcrypt
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
            from: 'tbgosalvez@protonmail.com',
            subject: 'Node Shop|Signup Successful!',
            html: '<h2>You have successfully signed up for Brian\'s Node.js shop!</h2>'
          })
        })
        .catch(e => console.log(e))
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
