const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const MONGODB_URI =
  "mongodb+srv://(es ist kaput)";

const errorController = require("./controllers/error");
const User = require("./models/user");
const dbstore = new MongoDBStore({ uri: MONGODB_URI, collection: "sessions" });

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoute = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "something something",
    resave: false,
    saveUninitialized: false,
    store: dbstore
  })
);

app.use((req,res,next) => {
  if(!req.session.user)
    return next();
    
  User.findById(req.session.user)
  .then(user => {
    req.user = user;
    next();
  })
  .catch(err => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoute);
app.use(errorController.get404);


mongoose
  .connect(MONGODB_URI)
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: "TBG",
          email: "tbg@test.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
