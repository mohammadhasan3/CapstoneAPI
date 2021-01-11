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
    console.log(rel);
    if (rel.length === 0) {
      rel = await Friend.findAll({
        where: {
          user1Id: otherId,
          user2Id: userId,
        },
      });
    }
    console.log(rel);
    return rel;
  } catch (error) {
    next(error);
  }
};

exports.addFriend = async (req, res, next) => {
  try {
    req.body.user1Id = req.user.id;
    req.body.actionUser = req.user.id;
    const newRelationship = await Friend.create(req.body);
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
        await Friend.update(
          { status: null },
          {
            where: {
              user1Id: req.user.id,
              user2Id: req.body.user2Id,
            },
          }
        );
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
