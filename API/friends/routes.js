const express = require("express");
const passport = require("passport");
const router = express.Router();
const { sendRequest, withdrawRequest } = require("./controllers");

router.put(
  "/withdrawRequest",
  passport.authenticate("jwt", { session: false }),
  withdrawRequest
);

router.post(
  "/sendRequest/:user2Id",
  passport.authenticate("jwt", { session: false }),
  sendRequest
);

module.exports = router;
