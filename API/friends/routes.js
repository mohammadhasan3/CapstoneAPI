const express = require("express");
const passport = require("passport");
const router = express.Router();
const { addFriend } = require("./controllers");

router.get("/", passport.authenticate("jwt", { session: false }), addFriend);

module.exports = router;
