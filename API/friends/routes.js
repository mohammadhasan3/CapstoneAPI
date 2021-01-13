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
  friendsList,
} = require("./controllers");

router.get("/", passport.authenticate("jwt", { session: false }), friendsList);

router.put(
  "/declineRequest/:user2Id",
  passport.authenticate("jwt", { session: false }),
  declineRequest
);

router.put(
  "/acceptRequest/:user2Id",
  passport.authenticate("jwt", { session: false }),
  acceptRequest
);

router.put(
  "/withdrawRequest/:user2Id",
  passport.authenticate("jwt", { session: false }),
  withdrawRequest
);

router.post(
  "/sendRequest/:user2Id",
  passport.authenticate("jwt", { session: false }),
  sendRequest
);

router.delete(
  "/deleteFriend/:user2Id",
  passport.authenticate("jwt", { session: false }),
  deleteFriend
);

router.put(
  "/blockUser/:user2Id",
  passport.authenticate("jwt", { session: false }),
  blockUser
);

module.exports = router;
