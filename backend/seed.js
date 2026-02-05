const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Post = require('./models/Post');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

const users = [
  { username: 'AlexExplorer', email: 'alex@example.com', password: 'password123', profilePic: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { username: 'SarahTravels', email: 'sarah@example.com', password: 'password123', profilePic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { username: 'MikeTech', email: 'mike@example.com', password: 'password123', profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { username: 'EmmaDesign', email: 'emma@example.com', password: 'password123', profilePic: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
];

const posts = [
  {
    content: "Just arrived in Tokyo! 🇯🇵 The streets are so vibrant and the food is amazing. Can't wait to explore more!",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    likes: [],
    comments: []
  },
  {
    content: "Working on a new React Native project today. The ecosystem is moving so fast! 💻 #devlife #coding",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    likes: [],
    comments: []
  },
  {
    content: "Sunday morning coffee and a good book. Perfect way to recharge. ☕📚",
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    likes: [],
    comments: []
  },
  {
    content: "Check out this beautiful sunset from my hike yesterday! Nature never fails to amaze. 🏔️🌄",
    image: "https://images.unsplash.com/photo-1495616811223-4d98c6e9d869?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    likes: [],
    comments: []
  },
  {
    content: "Trying out a new minimalist workspace setup. Less clutter, more focus. ✨",
    image: "https://images.unsplash.com/photo-1493934558415-9d19f0b2b4d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    likes: [],
    comments: []
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/socialapp');
    console.log('MongoDB Connected');

    // Create Users
    const createdUsers = [];
    for (let u of users) {
      let user = await User.findOne({ email: u.email });
      if (!user) {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        user = new User({ ...u, password: hashedPassword });
        await user.save();
        console.log(`User ${u.username} created`);
      } else {
        console.log(`User ${u.username} already exists`);
      }
      createdUsers.push(user);
    }

    // Create Posts
    for (let i = 0; i < posts.length; i++) {
      const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const newPost = new Post({
        userId: randomUser._id,
        ...posts[i]
      });
      await newPost.save();
      console.log(`Post ${i + 1} added by ${randomUser.username}`);
    }

    console.log('Seeding Complete! 🌱');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
