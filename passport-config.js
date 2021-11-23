const local = require("passport-local").Strategy;
const passport = require("passport");
const bcrypt = require("bcrypt");
const { users } = require("./dataDB");
const passportInit = (passport, getUserByUsername, getUserById) => {
  const auth = async (username, password, done) => {
    const user = await users.findOne({ username: username });
    if (!user) {
      return done(null, false, {
        message: "no user with that meail was found",
      });
    }
    if (await bcrypt.compare(password, user.password)) {
      return done(null, user);
    } else {
      return done(null, false, { message: "wrong password" });
    }
  };

  passport.use(new local(auth));

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));
};

module.exports = passportInit;
