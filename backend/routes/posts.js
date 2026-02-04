const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('userId', 'username profilePic')
      .populate('comments.userId', 'username profilePic')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create post
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { content } = req.body;
    let image = '';
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    const newPost = new Post({ userId: req.user.id, content, image });
    await newPost.save();

    const post = await Post.findById(newPost._id).populate('userId', 'username profilePic');

    // Real-time update
    req.io.emit('newPost', post);

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Like post
router.put('/:id/like', authMiddleware, async (req, res) => {
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
});

// Comment post
router.post('/:id/comment', authMiddleware, async (req, res) => {
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
});

module.exports = router;
