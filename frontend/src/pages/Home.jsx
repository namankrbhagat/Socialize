import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import CreatePost from '../components/CreatePost';
import Post from '../components/Post';
import axios from 'axios';
import { io } from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/posts');
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
  }, []);

  useEffect(() => {
    if (!socket) return;

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
  }, [socket]);

  return (
    <Container className="pt-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          {user && <CreatePost />}

          {loading ? (
            <div className="text-center mt-5"><Spinner animation="border" variant="primary" /></div>
          ) : (
            posts.map(post => <Post key={post._id} post={post} socket={socket} />)
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
