//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const port = 3000;
const env = "process.envy";

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB");

// const Schema = new mongoose.Schema

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const secret = `${env.LONG_STRING}`;
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] }); // Before mongoose.model

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
  });

  newUser.save((err) => {
    if (!err) res.render("secrets");
    if (err) console.log(err);
  });
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ email: username }, (err, foundUser) => {
    if (err) console.log(err);
    if (foundUser && foundUser.password === password) res.render("secrets");
  });
});

/////////////////////////////////////////////////
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
