const express = require("express");
const passport = require("passport");
const router = express.Router();
const { addFriend, withdrawRequest } = require("./controllers");

router.get("/", passport.authenticate("jwt", { session: false }), addFriend);
router.put(
  "/withdrawRequest",
  passport.authenticate("jwt", { session: false }),
  withdrawRequest
);

module.exports = router;
