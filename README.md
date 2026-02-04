# Social App

A mini social media application built with React, Node.js, Express, and MongoDB.

## Features
- User Signup & Login (JWT Auth)
- Create Posts (Text + Image)
- Public Feed with Real-time interactions
- Like & Comment system
- Responsive UI (Bootstrap)

## Tech Stack
- **Frontend**: React.js, Bootstrap, Material UI icons
- **Backend**: Node.js, Express, MongoDB, Socket.io
- **Database**: MongoDB Atlas

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB URI (local or Atlas)

### Backend Setup
1. Navigate to backend:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file with:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. Start server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to frontend:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start React app:
   ```bash
   npm run dev
   ```

## Deployment
- **Frontend**: Vercel / Netlify
- **Backend**: Render
