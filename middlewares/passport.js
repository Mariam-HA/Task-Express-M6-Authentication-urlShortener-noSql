const LocalStrategy = require("passport-local");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const JWTStrategy = require("passport-jwt").Strategy;
const { JWT_SECRET } = require("../config/keys");
const { fromAuthHeaderAsBearerToken } = require("passport-jwt").ExtractJwt;

exports.localStrategy = new LocalStrategy(
  { usernameField: "username" },
  async (username, password, done) => {
    try {
      const foundUser = await User.findOne({ username: username });
      if (!foundUser) {
        return done(null, false);
      }
      const passwordMatch = bcrypt.compare(password, foundUser.password);
      if (!passwordMatch) {
        return done(null, false);
      }
      return done(null, foundUser);
    } catch (error) {
      return done(error);
    }
  }
);

exports.jwtStrategy = new JWTStrategy(
  // Extract the token
  {
    jwtFromRequest: fromAuthHeaderAsBearerToken(), // don't forget to invoc the function
    secretOrKey: JWT_SECRET,
  },
  // Need Check the exp of the token
  async (jwtPayload, done) => {
    console.log(jwtPayload);
    if (Date.now() > jwtPayload.exp * 1000) {
      return done(null, false);
    }
    //*1000 to convert to (s) becase the time is in ms and we should covert to s.
    // Valid token exp
    try {
      const user = await User.findOne(jwtPayload.id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
);
