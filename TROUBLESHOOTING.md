# Share Dish - Troubleshooting Guide

## 🔍 Quick Diagnosis

### 1. Check Server Status
```bash
cd server
npm run test-connection
```

### 2. Check Browser Console
Open browser developer tools (F12) and check for errors in Console tab.

### 3. Check Server Logs
Look for error messages in the server terminal.

## 🚨 Common Issues & Solutions

### WhatsApp Verification Not Working

**Problem**: Cannot send or verify WhatsApp codes

**Solutions**:
1. **Check Twilio Configuration**:
   ```bash
   # In server/.env file, ensure these are set:
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_WHATSAPP_FROM=your_whatsapp_number
   ```

2. **Development Mode**: If Twilio is not configured, the app will use "Mock Mode"
   - Check server logs for generated codes
   - Codes are logged in console: `🔐 Generated code for +1234567890: 123456`

3. **Phone Number Format**: Use international format
   - ✅ Correct: `+201234567890`
   - ❌ Wrong: `01234567890` or `201234567890`

4. **Twilio Sandbox Setup**:
   - Go to https://console.twilio.com/
   - Navigate to WhatsApp Sandbox
   - Join the sandbox by sending the provided code
   - Use the sandbox number as `TWILIO_WHATSAPP_FROM`

### CORS Errors

**Problem**: Browser shows CORS errors in console

**Solutions**:
1. **Check Environment Variables**:
   ```bash
   # In server/.env
   FRONTEND_URL=http://localhost:3000
   
   # In client/.env
   REACT_APP_API_URL=http://localhost:5000
   ```

2. **Verify Ports**:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

3. **Restart Both Servers**:
   ```bash
   # Terminal 1 - Backend
   cd server
   npm start
   
   # Terminal 2 - Frontend
   cd client
   npm start
   ```

### Network Connection Issues

**Problem**: Cannot connect to server

**Solutions**:
1. **Check Server Status**:
   ```bash
   cd server
   npm run test-connection
   ```

2. **Verify MongoDB Connection**:
   ```bash
   # In server/.env
   MONGO_URI=mongodb://localhost:27017/share-dish
   ```

3. **Check Firewall**: Ensure port 5000 is not blocked

4. **Alternative MongoDB**: Use MongoDB Atlas
   ```bash
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/share-dish
   ```

### Authentication Issues

**Problem**: Cannot login or register

**Solutions**:
1. **Check JWT Secret**:
   ```bash
   # In server/.env
   JWT_SECRET=your-super-secret-jwt-key
   ```

2. **Clear Browser Storage**:
   - Open browser dev tools
   - Go to Application tab
   - Clear Local Storage and Session Storage

3. **Check Password Requirements**:
   - Minimum 6 characters
   - Must contain at least one number

### Image Upload Issues

**Problem**: Cannot upload images

**Solutions**:
1. **Check Cloudinary Configuration**:
   ```bash
   # In server/.env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

2. **File Size**: Ensure images are under 10MB

3. **File Format**: Use common formats (JPG, PNG, GIF)

## 🛠️ Debug Mode

### Enable Detailed Logging

1. **Server Logs**: All requests and responses are logged with emojis
2. **Client Logs**: Check browser console for API request/response logs
3. **WhatsApp Logs**: Check server console for WhatsApp operation logs

### Test Individual Endpoints

```bash
# Test server health
curl http://localhost:5000/

# Test WhatsApp endpoint
curl -X POST http://localhost:5000/api/auth/send-whatsapp-code \
  -H "Content-Type: application/json" \
  -d '{"phone": "+1234567890"}'

# Test posts endpoint
curl http://localhost:5000/api/posts
```

## 📋 Environment Checklist

### Server (.env)
- [ ] `PORT=5000`
- [ ] `MONGO_URI` (local or Atlas)
- [ ] `JWT_SECRET`
- [ ] `FRONTEND_URL=http://localhost:3000`
- [ ] `TWILIO_ACCOUNT_SID` (optional for development)
- [ ] `TWILIO_AUTH_TOKEN` (optional for development)
- [ ] `TWILIO_WHATSAPP_FROM` (optional for development)
- [ ] `CLOUDINARY_CLOUD_NAME` (optional)
- [ ] `CLOUDINARY_API_KEY` (optional)
- [ ] `CLOUDINARY_API_SECRET` (optional)

### Client (.env)
- [ ] `REACT_APP_API_URL=http://localhost:5000`

## 🔧 Manual Setup Steps

1. **Install Dependencies**:
   ```bash
   # Backend
   cd server
   npm install
   
   # Frontend
   cd client
   npm install
   ```

2. **Create Environment Files**:
   ```bash
   # Create server/.env
   # Create client/.env
   ```

3. **Start Servers**:
   ```bash
   # Terminal 1
   cd server
   npm start
   
   # Terminal 2
   cd client
   npm start
   ```

4. **Test Connection**:
   ```bash
   cd server
   npm run test-connection
   ```

## 📞 Getting Help

If you're still experiencing issues:

1. Check the server logs for detailed error messages
2. Check the browser console for client-side errors
3. Verify all environment variables are set correctly
4. Ensure both servers are running on the correct ports
5. Test the connection using the provided test script 