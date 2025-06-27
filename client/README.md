# Share Dish Client

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the client directory with the following variables:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000

# Development Configuration
REACT_APP_ENV=development
```

### 3. Start the Development Server
```bash
npm start
```

## Troubleshooting

### API Connection Issues

1. **Server Not Running**: Ensure the backend server is running on port 5000
2. **CORS Errors**: Check that the server CORS configuration matches your frontend URL
3. **Network Errors**: Check browser console for detailed error messages

### WhatsApp Verification Issues

1. **Mock Mode**: In development, WhatsApp verification works without sending actual messages
2. **Phone Number Format**: Use international format (e.g., +201234567890)
3. **Code Verification**: Check server logs for generated codes in mock mode

### Common Issues

1. **Port Conflicts**: If port 3000 is busy, React will suggest an alternative port
2. **Build Errors**: Check for TypeScript errors in the console
3. **Dependency Issues**: Delete node_modules and package-lock.json, then run `npm install`

## Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Project Structure

```
src/
├── components/     # Reusable components
├── contexts/       # React contexts
├── pages/          # Page components
├── utils/          # Utility functions (including axios.ts)
└── App.tsx         # Main app component
```

### API Integration

All API calls are centralized in `src/utils/axios.ts`:

- `authAPI` - Authentication endpoints
- `postsAPI` - Post management
- `usersAPI` - User management
- `chatAPI` - Chat functionality
- `messagesAPI` - Message handling
