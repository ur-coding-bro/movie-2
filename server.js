const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const app = express();
const bcrypt = require("bcrypt");
const session = require("express-session");
const passport = require("passport");
const passportInit = require("./passport-config");
const port = process.env.PORT || 5000;
const { movies_data } = require("./dataDB");

app.get("/moviesend", (req, res) => {
  console.log("requrested");

  movies_data.find().then((re) => res.json(re));
});

//auth system

const { users } = require("./dataDB");

passportInit(
  passport,
  (username) => users.find().then((item) => item.username === username),
  (id) => users.find().then((item) => item._id === id)
);

app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    resave: false,
    saveUninitialized: false,

    secret: process.env.SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60 * 5,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.post("/register-server", async (req, res) => {
  if (!(req.body.password === req.body.confirmPassword)) {
    return res.redirect("/register");
  }
  if (await users.findOne({ username: req.body.username })) {
    return res.redirect("/register");
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  users.create({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });
  console.log(users.find().then((res) => console.log(res)));
  return res.redirect("/login");
});
app.post(
  "/login-server",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/register",
  })
);

app.get("/logout", (req, res) => {
  req.logOut();
  res.clearCookie("connect.sid").redirect("http://localhost:3000/login");
});
app.get("/res", (req, res) => {
  if (req.user) {
    res.json({ username: req.user.username, email: req.user.email });
  } else {
    res.json({ username: "", email: "" });
  }
});
//end of auth system
mongoose.connect(process.env.ACC).then(() => {
  app.listen(port, () => {
    console.log(`listening to port ${port}`);
  });
});
