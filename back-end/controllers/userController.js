const User = require("../models/User");

// ✅ Follow/Unfollow Toggle
exports.toggleFollow = async (req, res) => {
  const { userId, celebrityId } = req.body;

  const user = await User.findById(userId);
  const celebrity = await User.findById(celebrityId);
  if (!user || !celebrity)
    return res.status(404).json({ message: "User not found" });

  const isFollowing = user.following.includes(celebrityId);

  if (isFollowing) {
    user.following = user.following.filter(
      (id) => id.toString() !== celebrityId
    );
    celebrity.followers = celebrity.followers.filter(
      (id) => id.toString() !== userId
    );
  } else {
    user.following.push(celebrityId);
    celebrity.followers.push(userId);
  }

  await user.save();
  await celebrity.save();

  res.json({ message: isFollowing ? "Unfollowed" : "Followed" });
};

// ✅ Get All Celebrities with follow status
exports.getCelebrities = async (req, res) => {
  const { userId } = req.query;

  const allCelebs = await User.find({
    role: "celebrity",
    _id: { $ne: userId },
  }).select("name _id");
  const currentUser = await User.findById(userId).select("following");

  const result = allCelebs.map((celeb) => ({
    _id: celeb._id,
    name: celeb.name,
    isFollowing: currentUser.following.includes(celeb._id),
  }));

  res.json(result);
};
