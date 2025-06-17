const Post = require("../models/Post");
const User = require("../models/User");

exports.createPost = async (req, res) => {
  try {
    const { content, celebrityId } = req.body;

    if (!content || !celebrityId) {
      return res
        .status(400)
        .json({ message: "Content and celebrityId are required" });
    }
    const post = new Post({
      text: content,
      image: req.file ? `/uploads/${req.file.filename}` : null,
      user: celebrityId,
    });
    await post.save();
    const io = req.app.get("io");
    const celebrity = await User.findById(celebrityId).populate(
      "followers",
      "_id"
    );
    // 1. Emit to the celebrity's room
    io.to(celebrityId).emit("newPost", post);

    // 2. Send notifications to followers
    const connectedUsers = io.connectedUsers;
    celebrity.followers.forEach((follower) => {
      const socketId = connectedUsers.get(follower._id.toString());
      if (socketId) {
        io.to(socketId).emit("newPostNotification", {
          from: celebrity.name,
          postId: post._id,
          message: `${celebrity.name} posted a new update!`,
        });
      }
    });

    res.status(201).json(post);
  } catch (err) {
    console.error("Error in createPost:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getUserPosts = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const posts = await Post.find({ user: req.params.id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json(posts);
  } catch (err) {
    console.error("Error fetching user posts:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getFeed = async (req, res) => {
  const { userId, page = 1, limit = 5 } = req.query;
  const user = await User.findById(userId);
  const posts = await Post.find({ user: { $in: user.following } })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  res.json(posts);
};
