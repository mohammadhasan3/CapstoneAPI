/* Requires */
const { Profile, User } = require("../../db/models");
/* Requires */

// User Profile Fetch Controller
exports.profileFetch = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findByPk(userId);
    const userProfile = await Profile.findOne({
      where: { id: user.profileId },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    res.json(userProfile);
  } catch (error) {
    next(error);
  }
};

// Profile Edit Controller
exports.profileEdit = async (req, res, next) => {
  try {
    const foundProfile = await Profile.findByPk(req.user.profileId);
    // If profile exists
    if (foundProfile) {
      if (req.file) {
        req.body.image = `http://${req.get("host")}/media/${req.file.filename}`;
      }
      await foundProfile.update(req.body);
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Profile not found" });
    }
  } catch (error) {
    next(error);
  }
};
