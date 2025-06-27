const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Improved CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  optionsSuccessStatus: 200
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`, {
    body: req.body,
    query: req.query,
    headers: {
      'content-type': req.headers['content-type'],
      'authorization': req.headers.authorization ? 'Bearer ***' : 'None'
    }
  });
  next();
});

// Import and use routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

const postRoutes = require('./routes/posts');
app.use('/api/posts', postRoutes);

const messageRoutes = require('./routes/messages');
app.use('/api/messages', messageRoutes);

const chatRoutes = require('./routes/chat');
app.use('/api/chat', chatRoutes);

app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Share Dish API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('🚨 Server Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
console.log('🔧 Server Configuration:', {
  PORT,
  MONGO_URI: MONGO_URI ? 'Set' : 'Not set',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  NODE_ENV: process.env.NODE_ENV || 'development'
});

// Connect to MongoDB with updated options
mongoose.connect(MONGO_URI, {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  }
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: false
    }
  });

  // Socket.io logic
  io.on('connection', (socket) => {
    console.log('🔌 User connected:', socket.id);

    // Join a chat room for a specific post
    socket.on('joinRoom', ({ postId }) => {
      socket.join(postId);
      console.log(`👥 User ${socket.id} joined room: ${postId}`);
    });

    // Handle sending a message
    socket.on('sendMessage', async ({ postId, sender, text }) => {
      try {
        // Save message to DB
        const Chat = require('./models/Chat');
        let chat = await Chat.findOne({ post: postId });
        if (!chat) {
          chat = new Chat({ post: postId, users: [sender], messages: [] });
        }
        chat.messages.push({ sender, text });
        await chat.save();

        // Emit message to all users in the room
        io.to(postId).emit('receiveMessage', {
          sender,
          text,
          createdAt: new Date()
        });
        console.log(`💬 Message sent in room ${postId}: ${text}`);
      } catch (error) {
        console.error('❌ Error saving message:', error);
        socket.emit('error', { message: 'Failed to save message' });
      }
    });

    socket.on('disconnect', () => {
      console.log('🔌 User disconnected:', socket.id);
    });
  });

  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 API available at: http://localhost:${PORT}`);
    console.log(`📱 Frontend should be at: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  });
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  console.log('💡 Please make sure MongoDB is installed and running, or provide a valid MONGO_URI in the .env file');
  process.exit(1);
});