const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');
const postController = require('../controllers/postController');

const upload = require('../middleware/uploadMiddleware');

router.get('/', postController.getPosts);
router.post('/', authMiddleware, upload.single('image'), postController.createPost);
router.put('/:id/like', authMiddleware, postController.likePost);
router.post('/:id/comment', authMiddleware, postController.commentPost);

module.exports = router;
