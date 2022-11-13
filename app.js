const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
// require("dotenv").config();

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

// userSchema.plugin(encrypt, {
//   secret: process.env.SECRET,
//   encryptedFields: ["password"],
// });

const User = new mongoose.model("user", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }, (err, docs) => {
      if (!err) {
        bcrypt.compare(password, docs.password, function (err, result) {
          if (result === true) res.render("secrets");
        });
      } else {
        res.send(err);
      }
    });
  });

app
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post((req, res) => {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
      // Store hash in your password DB.
      const newUser = new User({
        email: req.body.username,
        password: hash,
      });

      User.create(newUser, (err, doc) => {
        if (!err) {
          res.render("secrets");
        } else {
          res.send(err);
        }
      });
    });
  });

app.listen(3000, () => {
  console.log("server started on port 3000");
});
