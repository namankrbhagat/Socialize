import React, { useState, useContext } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Using API Base URL:', api.defaults.baseURL);
    console.log('Sending Login Request:', formData);
    try {
      const res = await api.post('/auth/login', formData);
      console.log('Login Success:', res.data);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      console.error('Login Error Full Object:', err);
      console.error('Error Response:', err.response);
      console.error('Error Message:', err.message);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '400px' }} className="p-4 shadow-sm">
        <h3 className="text-center mb-4">Login</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" placeholder="Enter email" required onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" placeholder="Password" required onChange={handleChange} />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">Login (v2.0)</Button>
        </Form>
        <div className="text-center mt-3">
          <small>Don't have an account? <Link to="/signup">Sign Up</Link></small>
        </div>
      </Card>
    </Container>
  );
};

export default Login;
