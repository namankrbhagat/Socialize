const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/me', authMiddleware, userController.getMe);
router.put('/save/:id', authMiddleware, userController.toggleSavePost);
router.get('/saved', authMiddleware, userController.getSavedPosts);

module.exports = router;
