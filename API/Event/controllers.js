const { Event } = require("../../db/models");

//FetchEvents
exports.fetchEvent = async (eventId, next) => {
  try {
    const event = await Event.findByPk(eventId);
    return event;
  } catch (error) {
    next(error);
  }
};

//EventsList
exports.eventsList = async (req, res) => {
  try {
    const events = await Event.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    res.status(201).json(events);
  } catch (err) {
    next(err);
  }
};

//Event create
exports.eventCreate = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = `http://${req.get("host")}/media/${req.file.filename}`;
    }
    req.body.userId = req.user.id;
    const newEvent = await Event.create(req.body);
    res.status(201).json(newEvent);
  } catch (error) {
    next(error);
  }
};

//Update Events
exports.eventUpdate = async (req, res, next) => {
  const { eventId } = req.params;

  try {
    if (req.user.id === req.event.userId) {
      const foundEvent = await this.fetchEvent(eventId, next);
      if (req.file) {
        req.body.image = `${req.protocol}://${req.get("host")}/media/${
          req.file.filename
        }`;
      }
      if (foundEvent) {
        await foundEvent.update(req.body);
        res.status(204).end();
      } else {
        const err = new Error("Event Not Found");
        err.status = 404;
        next(err);
      }
    } else {
      const err = new Error("Unauthorized");
      err.status = 401;
      next(err);
    }
  } catch (error) {
    next(error);
  }
};

//Delete Event
exports.eventDelete = async (req, res, next) => {
  const { eventId } = req.params;
  try {
    const foundEvent = await Event.findByPk(eventId);
    if (req.user.id === req.event.userId) {
      if (foundEvent) {
        await foundEvent.destroy();
        res.status(204).end();
      } else {
        res.status(404).json({ message: "Event not found" });
      }
    } else {
      const err = new Error("Unauthorized");
      err.status = 401;
      next(err);
    }
  } catch (err) {
    next(err);
  }
};
