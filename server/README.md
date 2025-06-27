# Share Dish Server

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the server directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/share-dish
# Or use MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/share-dish

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Twilio Configuration (for WhatsApp verification)
# Get these from https://console.twilio.com/
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_FROM=+1234567890

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 3. Start the Server
```bash
npm start
```

## Troubleshooting

### WhatsApp Verification Issues

1. **Twilio Not Configured**: If you see "Mock mode" in logs, WhatsApp verification will work in development without sending actual messages.

2. **Phone Number Format**: Ensure phone numbers include country code (e.g., +201234567890).

3. **Twilio Sandbox**: For testing, you need to:
   - Join Twilio WhatsApp sandbox
   - Send the provided code to the Twilio number
   - Use the sandbox number as TWILIO_WHATSAPP_FROM

### CORS Issues

1. **Frontend URL**: Ensure FRONTEND_URL in .env matches your frontend URL
2. **Port Configuration**: Default is http://localhost:3000 for frontend, http://localhost:5000 for backend

### MongoDB Issues

1. **Local MongoDB**: Install and start MongoDB locally
2. **MongoDB Atlas**: Use connection string from Atlas dashboard
3. **Network Issues**: Check firewall and network connectivity

### Common Error Codes

- **401**: Unauthorized - Check JWT token
- **403**: Forbidden - Invalid token
- **404**: Route not found
- **500**: Server error - Check server logs

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/send-whatsapp-code` - Send WhatsApp verification
- `POST /api/auth/verify-whatsapp-code` - Verify WhatsApp code

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `PATCH /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `PATCH /api/posts/:id/reserve` - Reserve post
- `POST /api/posts/upload` - Upload image

### Users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Chat
- `GET /api/chat/user/:userId` - Get user chats
- `POST /api/chat/start` - Start new chat
- `POST /api/chat/:postId/message` - Send message

### Messages
- `GET /api/messages/unread/:userId` - Get unread count 