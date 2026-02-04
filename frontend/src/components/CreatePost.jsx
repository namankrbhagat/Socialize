import React, { useState } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
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
      await axios.post('http://localhost:5000/api/posts', formData, {
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
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="border-0"
              style={{ resize: 'none', fontSize: '1.1rem' }}
            />
          </Form.Group>
          {preview && (
            <div className="mb-3 position-relative">
              <img src={preview} alt="Preview" className="img-fluid rounded" style={{ maxHeight: '300px' }} />
              <Button
                variant="light"
                size="sm"
                className="position-absolute top-0 end-0 m-1 rounded-circle"
                onClick={() => { setImage(null); setPreview(null); }}
              >
                &times;
              </Button>
            </div>
          )}
          <hr />
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Form.Label htmlFor="image-upload" className="mb-0 text-primary" style={{ cursor: 'pointer' }}>
                <InsertPhotoIcon fontSize="large" />
              </Form.Label>
              <Form.Control
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>
            <Button variant="primary" type="submit" disabled={!content && !image} className="px-4 rounded-pill">
              Post <SendIcon fontSize="small" className="ms-1" />
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CreatePost;
