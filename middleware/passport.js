/* Requires */
const bcrypt = require("bcrypt");
const { User } = require("../db/models");

const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const { JWT_SECRET } = require("../config/keys");
const { fromAuthHeaderAsBearerToken } = require("passport-jwt").ExtractJwt;
/* Requires */

exports.localStrategy = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ where: { username: username } });

    const userAuthentication = user
      ? await bcrypt.compare(password, user.password)
      : false;

    if (userAuthentication) return done(null, user);
    else return done(null, false);
  } catch (error) {
    done(error);
  }
});

exports.jwtStrategy = new JWTStrategy(
  {
    jwtFromRequest: fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
  },
  async (jwtPayload, done) => {
    if (Date.now() > jwtPayload.exp) {
      return done(null, false);
    }
    try {
      const user = await User.findByPk(jwtPayload.id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
);
