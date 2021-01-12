const { User, Friend } = require("../../db/models");

exports.PENDING = 0;
exports.ACCEPTED = 1;
exports.DECLINED = 2;
exports.BLOCKED = 3;

//FetchRelationship
exports.fetchRelationship = async (userId, otherId, next) => {
  try {
    let rel = await Friend.findAll({
      where: {
        user1Id: userId,
        user2Id: otherId,
      },
    });

    if (rel.length === 0) {
      rel = await Friend.findAll({
        where: {
          user1Id: otherId,
          user2Id: userId,
        },
      });
    }
    return rel;
  } catch (error) {
    next(error);
  }
};

exports.sendRequest = async (req, res, next) => {
  try {
    // This will change to param later
    req.body.user1Id = req.user.id;
    req.body.user2Id = req.params.user2Id;
    req.body.actionUser = req.user.id;

    console.log(req.body);
    // A condition so that user1 cannot send request to user1
    if (req.body.user1Id != req.body.user2Id) {
      req.body.status = this.PENDING;
      const newRelationship = await Friend.create(req.body);
      res.json(newRelationship);
    } else {
      console.log("You cannot friend yourself");
    }
  } catch (error) {
    next(error);
  }
};

exports.withdrawRequest = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const otherId = req.body.user2Id;
    const relationship = await this.fetchRelationship(userId, otherId, next);
    console.log(relationship[0].actionUser);
    if (relationship) {
      if (relationship[0].actionUser === req.user.id) {
        await Friend.destroy({
          where: {
            user1Id: req.user.id,
            user2Id: req.body.user2Id,
          },
        });
        res.status(204).end();
      } else {
        const err = new Error("Unauthorized");
        err.status = 401;
        next(err);
      }
    }
  } catch (error) {
    next(error);
  }
};

exports.acceptRequest = async (req, res, next) => {};
