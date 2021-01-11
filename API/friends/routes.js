const express = require("express");
const passport = require("passport");
const router = express.Router();
const { addFriend, withdrawRequest } = require("./controllers");


router.put(
  "/withdrawRequest",
  passport.authenticate("jwt", { session: false }),
  withdrawRequest
const { sendRequest } = require("./controllers");

router.get(
  "/sendRequest",
  passport.authenticate("jwt", { session: false }),
  sendRequest
);

module.exports = router;
