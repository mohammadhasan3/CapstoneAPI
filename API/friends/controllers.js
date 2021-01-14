const { User, Friend } = require("../../db/models");
const { Sequelize, Op } = require("sequelize");

exports.PENDING = 0;
exports.ACCEPTED = 1;
exports.DECLINED = 2;
exports.BLOCKED = 3;

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

//FriendsList
exports.friendsList = async (req, res) => {
  try {
    const friends = await Friend.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    res.json(friends);
  } catch (err) {
    next(err);
  }
};

exports.sendRequest = async (req, res, next) => {
  try {
    req.body.user1Id = req.user.id;
    req.body.user2Id = req.params.user2Id;
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

exports.withdrawRequest = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const otherId = req.params.user2Id;

    const relationship = await this.fetchRelationship(userId, otherId, next);
    console.log(relationship);
    if (relationship) {
      if (relationship[0].actionUser === req.user.id) {
        await Friend.destroy({
          where: {
            user1Id: req.user.id,
            user2Id: req.params.user2Id,
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

exports.acceptRequest = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const otherId = req.params.user2Id;

    const relationship = await this.fetchRelationship(userId, otherId, next);
    if (relationship) {
      if (relationship[0].status === this.ACCEPTED) {
        res.json("You're already friends");
        return;
      }
      if (relationship[0].user2Id === req.user.id) {
        await relationship[0].update(
          {
            status: this.ACCEPTED,
          },
          {
            where: {
              user1Id: req.user.id,
              user2Id: req.params.user2Id,
            },
          }
        );

        await User.update(
          {
            friends: Sequelize.fn(
              "array_append",
              Sequelize.col("friends"),
              req.user.id
            ),
          },
          { where: { id: relationship[0].user1Id } }
        );

        await User.update(
          {
            friends: Sequelize.fn(
              "array_append",
              Sequelize.col("friends"),
              relationship[0].user1Id
            ),
          },
          { where: { id: req.user.id } }
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

exports.declineRequest = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const otherId = req.params.user2Id;

    const relationship = await this.fetchRelationship(userId, otherId, next);
    if (relationship) {
      if (relationship[0].actionUser === req.user.id) {
        await Friend.destroy({
          where: {
            user1Id: req.user.id,
            user2Id: req.params.user2Id,
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

exports.deleteFriend = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const otherId = req.params.user2Id;

    const relationship = await this.fetchRelationship(userId, otherId, next);
    if (relationship) {
      if (
        req.user.id === relationship[0].user1Id ||
        req.user.id === relationship[0].user2Id
      ) {
        await User.update(
          {
            friends: Sequelize.fn(
              "array_remove",
              Sequelize.col("friends"),
              relationship[0].user2Id
            ),
          },
          { where: { id: relationship[0].user1Id } }
        );
        await User.update(
          {
            friends: Sequelize.fn(
              "array_remove",
              Sequelize.col("friends"),
              relationship[0].user1Id
            ),
          },
          { where: { id: relationship[0].user2Id } }
        );

        await relationship[0].destroy();
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

exports.blockUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const otherId = req.params.user2Id;

    const relationship = await this.fetchRelationship(userId, otherId, next);
    if (relationship.length > 0) {
      await Friend.update(
        { status: this.BLOCKED },
        {
          where: {
            user1Id: req.user.id,
            user2Id: req.params.user2Id,
          },
        }
      );
      await User.update(
        {
          blockedBy: Sequelize.fn(
            "array_append",
            Sequelize.col("blockedBy"),
            req.user.id
          ),
        },
        { where: { id: otherId } }
      );

      res.status(204).end();
    } else {
      req.body.user1Id = req.user.id;
      req.body.actionUser = req.user.id;
      req.body.user2Id = otherId;
      // A condition so that user1 cannot send request to user1
      if (req.body.user1Id != req.body.user2Id) {
        req.body.status = this.PENDING;
        await Friend.create(req.body);
        await Friend.update(
          { status: this.BLOCKED },
          {
            where: {
              user1Id: req.user.id,
              user2Id: req.body.user2Id,
            },
          }
        );
        await User.update(
          {
            blockedBy: Sequelize.fn(
              "array_append",
              Sequelize.col("blockedBy"),
              req.user.id
            ),
          },
          { where: { id: otherId } }
        );

        res.status(204).end();
      }
    }
  } catch (error) {
    next(error);
  }
};
