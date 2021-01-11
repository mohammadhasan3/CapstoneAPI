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

exports.sendRequest = async (req, res, next) => {
  try {
    // This will change to param later
    req.body.user1Id = req.user.id;
    req.body.actionUser = req.user.id;
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
