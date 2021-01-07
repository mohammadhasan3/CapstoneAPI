/* Requires */
const express = require("express");
const router = express.Router();
// Controllers
const { profileFetch, profileEdit } = require("./controllers");
// Upload Images
const upload = require("../../middleware/multer");
// Passport
const passport = require("passport");
/* Requires */

// Profile Fetch
router.get("/:userId", profileFetch);

// Profile Edit
router.put(
  "/",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  profileEdit
);

module.exports = router;
