const User = require('../models/User');
const Post = require('../models/Post');

// Toggle Save Post
exports.toggleSavePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const user = await User.findById(req.user.id);

    if (user.savedPosts.includes(postId)) {
      user.savedPosts = user.savedPosts.filter(id => id.toString() !== postId);
      await user.save();
      return res.json({ message: 'Post unsaved', savedPosts: user.savedPosts });
    } else {
      user.savedPosts.push(postId);
      await user.save();
      return res.json({ message: 'Post saved', savedPosts: user.savedPosts });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Saved Posts
exports.getSavedPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'savedPosts',
      populate: { path: 'userId', select: 'username profilePic' }
    });
    res.json(user.savedPosts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Data of Logged in User (including saved posts)
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const updates = {};
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (req.file) {
      updates.profilePic = req.file.path; // Cloudinary returns the full URL in `path`
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
