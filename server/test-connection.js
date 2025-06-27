// Test script to verify server configuration
const axios = require('axios');

const SERVER_URL = 'http://localhost:5000';

async function testConnection() {
  console.log('🔍 Testing server connection...\n');

  try {
    // Test basic server connection
    console.log('1. Testing server health...');
    const healthResponse = await axios.get(`${SERVER_URL}/`);
    console.log('✅ Server is running:', healthResponse.data);
    console.log('');

    // Test WhatsApp endpoint
    console.log('2. Testing WhatsApp endpoint...');
    const whatsappResponse = await axios.post(`${SERVER_URL}/api/auth/send-whatsapp-code`, {
      phone: '+1234567890'
    });
    console.log('✅ WhatsApp endpoint working:', whatsappResponse.data);
    console.log('');

    // Test posts endpoint
    console.log('3. Testing posts endpoint...');
    const postsResponse = await axios.get(`${SERVER_URL}/api/posts`);
    console.log('✅ Posts endpoint working:', `Found ${postsResponse.data.length} posts`);
    console.log('');

    console.log('🎉 All tests passed! Server is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure the server is running on port 5000');
      console.log('   Run: npm start in the server directory');
    }
    
    if (error.response) {
      console.log('📊 Response status:', error.response.status);
      console.log('📊 Response data:', error.response.data);
    }
  }
}

// Run the test
testConnection(); 