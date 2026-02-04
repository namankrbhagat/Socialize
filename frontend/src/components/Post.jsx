import React, { useState, useContext } from 'react';
import { Card, Image, Button, Form, InputGroup } from 'react-bootstrap';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentIcon from '@mui/icons-material/Comment';
import SendIcon from '@mui/icons-material/Send';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

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

const Post = ({ post, socket }) => {
  const { user } = useContext(AuthContext);
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  const isLiked = likes.includes(user?._id || user?.id);

  const handleLike = async () => {
    try {
      if (!user) return;
      // Optimistic update
      const newLikes = isLiked ? likes.filter(id => id !== (user._id || user.id)) : [...likes, (user._id || user.id)];
      // setLikes(newLikes); // Wait for socket or server resp

      await axios.put(`http://localhost:5000/api/posts/${post._id}/like`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await axios.post(`http://localhost:5000/api/posts/${post._id}/comment`, { text: commentText });
      setCommentText('');
    } catch (err) {
      console.error(err);
    }
  };

  // React to socket updates being passed down or manage state locally via parent. 
  // Ideally, Feed manages the state, but we can also update local state if we want isolated updates.
  // We will assume Feed passes updated posts or we use useEffect to listen if we want distinct listeners (expensive).
  // Actually, standard is to update the Feed list.
  // But for simple like toggle without refetching whole feed:

  // We will use the props passed from Feed, interactions handled by parent re-render or internal effect?
  // Let's use internal state synced with props, but updated by socket events in Feed?
  // Actually, if Feed handles socket events and updates the list, `post` prop changes, and we re-render.
  // So we just use `post` prop.

  // Re-assigning to local variables to avoid direct prop mutation is better if we didn't have parent updating.
  // But here, let's rely on props for data. 
  // Wait, `likes` state was initialized from props. React doesn't auto-update state from props change unless useEffect.
  // Let's use `post.likes` directly.

  return (
    <Card className="mb-3 shadow-sm border-0" style={{ borderRadius: '15px' }}>
      <Card.Body>
        <div className="d-flex align-items-center mb-3">
          <Image
            src={post.userId?.profilePic || "https://via.placeholder.com/40"}
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
          <Image src={`http://localhost:5000${post.image}`} fluid rounded className="mb-3 w-100" style={{ maxHeight: '500px', objectFit: 'cover' }} />
        )}

        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="d-flex gap-3">
            <div onClick={handleLike} style={{ cursor: 'pointer' }} className="d-flex align-items-center text-muted">
              {post.likes.includes(user?.id) ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
              <span className="ms-1">{post.likes.length}</span>
            </div>
            <div onClick={() => setShowComments(!showComments)} style={{ cursor: 'pointer' }} className="d-flex align-items-center text-muted">
              <CommentIcon />
              <span className="ms-1">{post.comments.length}</span>
            </div>
          </div>
        </div>

        {showComments && (
          <div className="mt-3">
            {post.comments.map((comment, index) => (
              <div key={index} className="d-flex mb-2">
                <Image
                  src={comment.userId?.profilePic || "https://via.placeholder.com/30"}
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
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default Post;
