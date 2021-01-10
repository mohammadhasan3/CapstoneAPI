const { User, Friend } = require("../../db/models");

exports.PENDING = 0;
exports.ACCEPTED = 1;
exports.DECLINED = 2;
exports.BLOCKED = 4;

exports.addFriend = async (req, res, next) => {
  try {
    req.body.user1Id = req.user.id;
    req.body.actionUser = req.user.id;
    console.log(req.body);
    const newRelationship = await Friend.create(req.body);
    console.log(newRelationship);
  } catch (error) {
    next(error);
  }
};
