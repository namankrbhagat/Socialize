import React, { useState, useContext, useEffect } from 'react';
import { Card, Image, Button, Form, InputGroup } from 'react-bootstrap';
import { api, baseURL } from '../api';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentIcon from '@mui/icons-material/Comment';
import SendIcon from '@mui/icons-material/Send';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
};

const getProfileSrc = (user) => {
  if (!user?.profilePic || user.profilePic.includes('ui-avatars.com')) {
    return "/avatar.png";
  }
  return user.profilePic;
};

const Post = ({ post, socket }) => {
  const { user } = useContext(AuthContext);
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (user && user.savedPosts) {
      setIsSaved(user.savedPosts.includes(post._id));
    }
  }, [user, post._id]);

  const isLiked = likes.includes(user?._id || user?.id);

  const handleLike = async () => {
    try {
      if (!user) return;
      await api.put(`/posts/${post._id}/like`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    try {
      if (!user) return;
      await api.put(`/users/save/${post._id}`);
      setIsSaved(!isSaved);
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await api.post(`/posts/${post._id}/comment`, { text: commentText });
      setCommentText('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mb-3 shadow-sm border-0" style={{ borderRadius: '15px' }}>
        <Card.Body>
          <div className="d-flex align-items-center mb-3">
            <Image
              src={getProfileSrc(post.userId)}
              roundedCircle
              width={40}
              height={40}
              className="me-2"
            />
            <div>
              <div className="fw-bold">{post.userId?.username || 'Unknown User'}</div>
              <div className="text-muted small">{timeAgo(post.createdAt)}</div>
            </div>
          </div>

          <Card.Text>{post.content}</Card.Text>

          {post.image && (
            <Image src={`${baseURL}${post.image}`} fluid rounded className="mb-3 w-100" style={{ maxHeight: '500px', objectFit: 'cover' }} />
          )}

          <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="d-flex gap-3">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLike}
                style={{ cursor: 'pointer' }}
                className="d-flex align-items-center text-muted"
              >
                {post.likes.includes(user?.id) ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                <span className="ms-1">{post.likes.length}</span>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowComments(!showComments)}
                style={{ cursor: 'pointer' }}
                className="d-flex align-items-center text-muted"
              >
                <CommentIcon />
                <span className="ms-1">{post.comments.length}</span>
              </motion.div>
            </div>

            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSave}
              style={{ cursor: 'pointer' }}
              className="text-muted"
            >
              {isSaved ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
            </motion.div>
          </div>

          {showComments && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-3"
            >
              {post.comments.map((comment, index) => (
                <div key={index} className="d-flex mb-2">
                  <Image
                    src={getProfileSrc(comment.userId)}
                    roundedCircle
                    width={30}
                    height={30}
                    className="me-2"
                  />
                  <div className="bg-light p-2 rounded w-100">
                    <div className="fw-bold small">{comment.userId?.username}</div>
                    <div className="small">{comment.text}</div>
                  </div>
                </div>
              ))}

              {user && (
                <Form onSubmit={handleComment} className="mt-2">
                  <InputGroup>
                    <Form.Control
                      placeholder="Write a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <Button variant="outline-primary" type="submit">
                      <SendIcon fontSize="small" />
                    </Button>
                  </InputGroup>
                </Form>
              )}
            </motion.div>
          )}
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default Post;
