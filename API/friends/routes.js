const express = require("express");
const passport = require("passport");
const router = express.Router();
const {
  sendRequest,
  withdrawRequest,
  deleteFriend,
  blockUser,
} = require("./controllers");

router.put(
  "/withdrawRequest",
  passport.authenticate("jwt", { session: false }),
  withdrawRequest
);

router.get(
  "/sendRequest",
  passport.authenticate("jwt", { session: false }),
  sendRequest
);

router.delete(
  "/deleteFriend",
  passport.authenticate("jwt", { session: false }),
  deleteFriend
);

router.put(
  "/blockUser",
  passport.authenticate("jwt", { session: false }),
  blockUser
);

module.exports = router;
