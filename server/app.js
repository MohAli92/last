const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

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

app.get('/', (req, res) => {
  res.send('Share Dish API is running');
});

const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
console.log('Using MONGO_URI:', MONGO_URI);

// Connect to MongoDB with updated options
mongoose.connect(MONGO_URI, {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  }
})
.then(() => {
  console.log('Connected to MongoDB');
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: '*', // In production, set this to your frontend URL
      methods: ['GET', 'POST']
    }
  });

  // Socket.io logic
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join a chat room for a specific post
    socket.on('joinRoom', ({ postId }) => {
      socket.join(postId);
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
      } catch (error) {
        console.error('Error saving message:', error);
        socket.emit('error', { message: 'Failed to save message' });
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  console.log('Please make sure MongoDB is installed and running, or provide a valid MONGO_URI in the .env file');
  process.exit(1);
});