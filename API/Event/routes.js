const express = require("express");
const upload = require("../../middleware/multer");
const passport = require("passport");

const router = express.Router();
const {
  eventsList,
  fetchEvent,
  eventCreate,
  eventUpdate,
  eventDelete,
} = require("./controllers");

router.param("eventId", async (req, res, next, eventId) => {
  const event = await fetchEvent(eventId, next);
  if (event) {
    req.event = event;
    next();
  } else {
    const err = new Error("Event Not Found");
  }
});

//Event create
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  eventCreate
);

//Read Event
router.get("/", eventsList);

//Update Event
router.put(
  "/:eventId",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  eventUpdate
);

//Delete Event
router.delete(
  "/:eventId",
  passport.authenticate("jwt", { session: false }),
  eventDelete
);

module.exports = router;
