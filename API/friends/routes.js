const express = require("express");
const passport = require("passport");
const router = express.Router();
const {
  sendRequest,
  withdrawRequest,

  deleteFriend,
  blockUser,
  acceptRequest,
  declineRequest,
} = require("./controllers");

router.put(
  "/declineRequest",
  passport.authenticate("jwt", { session: false }),
  declineRequest
);

router.put(
  "/acceptRequest",
  passport.authenticate("jwt", { session: false }),
  acceptRequest
);

router.put(
  "/withdrawRequest",
  passport.authenticate("jwt", { session: false }),
  withdrawRequest
);

router.post(
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
