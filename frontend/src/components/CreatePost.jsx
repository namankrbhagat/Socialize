import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { api } from '../api';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import SendIcon from '@mui/icons-material/Send';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('content', content);
    if (image) formData.append('image', image);

    try {
      await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setContent('');
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card className="mb-4 shadow-sm border-0" style={{ borderRadius: '15px' }}>
      <Card.Body className="p-3">
        <h5 className="mb-3 ps-2 fw-bold text-dark">Create Post</h5>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3 bg-light rounded p-2">
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="border-0 bg-light"
              style={{ resize: 'none', fontSize: '1.1rem', boxShadow: 'none' }}
            />
          </Form.Group>
          {preview && (
            <div className="mb-3 position-relative">
              <img src={preview} alt="Preview" className="img-fluid rounded" style={{ maxHeight: '300px', width: '100%', objectFit: 'cover' }} />
              <Button
                variant="dark"
                size="sm"
                className="position-absolute top-0 end-0 m-2 rounded-circle"
                onClick={() => { setImage(null); setPreview(null); }}
              >
                &times;
              </Button>
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center mt-2 px-2">
            <div>
              <Form.Label htmlFor="image-upload" className="mb-0 text-secondary" style={{ cursor: 'pointer', transition: 'transform 0.2s' }} onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'} onMouseOut={(e) => e.target.style.transform = 'scale(1)'}>
                <div className="d-flex align-items-center gap-2">
                  <InsertPhotoIcon color="success" /> <span className="small fw-semibold">Photo</span>
                </div>
              </Form.Label>
              <Form.Control
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>
            <Button variant="primary" type="submit" disabled={!content && !image} className="px-4 rounded-pill fw-bold shadow-sm">
              Post <SendIcon fontSize="small" className="ms-1" />
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CreatePost;
