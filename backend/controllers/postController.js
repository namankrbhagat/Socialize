const Post = require('../models/Post');

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('userId', 'username profilePic')
      .populate('comments.userId', 'username profilePic')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;
    let image = '';
    if (req.file) {
      image = req.file.path; // Cloudinary returns the full URL in `path`
    }

    const newPost = new Post({ userId: req.user.id, content, image });
    await newPost.save();

    const post = await Post.findById(newPost._id).populate('userId', 'username profilePic');

    req.io.emit('newPost', post);

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post.likes.includes(req.user.id)) {
      post.likes.push(req.user.id);
    } else {
      post.likes = post.likes.filter(id => id.toString() !== req.user.id);
    }

    await post.save();

    req.io.emit('updateLikes', { postId: post._id, likes: post.likes });

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.commentPost = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);

    const newComment = { userId: req.user.id, text, createdAt: new Date() };
    post.comments.push(newComment);

    await post.save();

    const updatedPost = await Post.findById(req.params.id).populate('comments.userId', 'username profilePic');
    const addedComment = updatedPost.comments[updatedPost.comments.length - 1];

    req.io.emit('newComment', { postId: post._id, comment: addedComment });

    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
