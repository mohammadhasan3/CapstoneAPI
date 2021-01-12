/* Requires */
const express = require("express");
const router = express.Router();
const passport = require("passport");
const { signup, signin, usersList } = require("./controllers");
/* Requires */

router.post("/signup", signup);

router.post(
  "/signin",
  passport.authenticate("local", { session: false }),
  signin
);

router.get("/", usersList);

module.exports = router;
