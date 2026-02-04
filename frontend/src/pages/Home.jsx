import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Spinner, Card, ListGroup, Button } from 'react-bootstrap';
import CreatePost from '../components/CreatePost';
import Post from '../components/Post';
import axios from 'axios';
import { io } from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import HomeIcon from '@mui/icons-material/Home';
import BookmarkIcon from '@mui/icons-material/Bookmark';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [view, setView] = useState('feed'); // 'feed' or 'saved'

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        let res;
        if (view === 'saved') {
          res = await axios.get('http://localhost:5000/api/users/saved');
        } else {
          res = await axios.get('http://localhost:5000/api/posts');
        }
        setPosts(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchPosts();

    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    return () => newSocket.close();
  }, [view]);

  useEffect(() => {
    if (!socket || view === 'saved') return; // Don't auto-update feed when viewing saved

    socket.on('newPost', (post) => {
      setPosts((prev) => [post, ...prev]);
    });

    socket.on('updateLikes', ({ postId, likes }) => {
      setPosts((prev) => prev.map(p => p._id === postId ? { ...p, likes } : p));
    });

    socket.on('newComment', ({ postId, comment }) => {
      setPosts((prev) => prev.map(p => {
        if (p._id === postId) {
          return { ...p, comments: [...p.comments, comment] };
        }
        return p;
      }));
    });

    return () => {
      socket.off('newPost');
      socket.off('updateLikes');
      socket.off('newComment');
    };
  }, [socket, view]);

  // Sidebar Component
  const Sidebar = () => (
    <Card className="border-0 shadow-sm" style={{ borderRadius: '15px', position: 'sticky', top: '90px' }}>
      <Card.Body className="p-0">
        <ListGroup variant="flush" className="rounded-3">
          <ListGroup.Item
            action
            className={`border-0 p-3 d-flex align-items-center gap-3 ${view === 'feed' ? 'bg-light fw-bold' : ''}`}
            onClick={() => setView('feed')}
          >
            <HomeIcon color={view === 'feed' ? "primary" : "inherit"} /> <span>Feed</span>
          </ListGroup.Item>
          <ListGroup.Item
            action
            className={`border-0 p-3 d-flex align-items-center gap-3 ${view === 'saved' ? 'bg-light fw-bold' : ''}`}
            onClick={() => setView('saved')}
          >
            <BookmarkIcon color={view === 'saved' ? "primary" : "inherit"} /> <span>Saved</span>
          </ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );

  return (
    <Container fluid className="pt-0 px-lg-5">
      <Row>
        {/* Left Sidebar */}
        <Col lg={3} className="d-none d-lg-block">
          <Sidebar />
        </Col>

        {/* Middle Feed */}
        <Col md={12} lg={6} className="mx-auto">
          {user && view === 'feed' && <CreatePost />}

          {view === 'saved' && <h4 className="mb-3 fw-bold">Saved Posts</h4>}

          {loading ? (
            <div className="text-center mt-5"><Spinner animation="border" variant="primary" /></div>
          ) : (
            posts.length > 0 ? (
              posts.map(post => <Post key={post._id} post={post} socket={socket} />)
            ) : (
              <div className="text-center mt-5 text-muted">No posts found.</div>
            )
          )}
        </Col>

        {/* Right Widgets - Removed Suggested Users as requested */}
        <Col lg={3} className="d-none d-lg-block">
          <div className="text-muted small px-2 sticky-top" style={{ top: '90px' }}>
            © 2026 Socialize. All rights reserved.
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
