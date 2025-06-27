// Twilio WhatsApp verification utility
const twilio = require('twilio');
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM;

console.log('📱 WhatsApp Configuration:', {
  accountSid: accountSid ? 'Set' : 'Not set',
  authToken: authToken ? 'Set' : 'Not set',
  whatsappFrom: whatsappFrom || 'Not set',
  isDevelopment: process.env.NODE_ENV === 'development'
});

// Initialize Twilio client only if credentials are available
let client = null;
if (accountSid && authToken) {
  try {
    client = twilio(accountSid, authToken);
    console.log('✅ Twilio client initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Twilio client:', error);
  }
} else {
  console.warn('⚠️ Twilio credentials not found. WhatsApp verification will use mock mode.');
}

// In-memory store for phone verifications (for demo, use Redis/DB in production)
const phoneVerifications = {};

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendVerificationCode(phone) {
  console.log(`📤 Attempting to send WhatsApp code to: ${phone}`);
  
  const code = generateCode();
  phoneVerifications[phone] = { 
    code, 
    expires: Date.now() + 5 * 60 * 1000, // 5 minutes
    attempts: 0
  };
  
  console.log(`🔐 Generated code for ${phone}: ${code}`);
  
  // If Twilio is not configured, use mock mode for development
  if (!client) {
    console.log(`🎭 Mock mode: Code ${code} would be sent to ${phone}`);
    console.log(`💡 In production, set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_WHATSAPP_FROM in .env`);
    return true;
  }
  
  try {
    // Format phone number for WhatsApp
    let formattedPhone = phone;
    if (!phone.startsWith('whatsapp:')) {
      formattedPhone = `whatsapp:${phone}`;
    }
    
    console.log(`📱 Sending WhatsApp message to: ${formattedPhone}`);
    
    const message = await client.messages.create({
      from: `whatsapp:${whatsappFrom}`,
      to: formattedPhone,
      body: `Your Share Dish verification code is: ${code}\n\nThis code will expire in 5 minutes.`
    });
    
    console.log(`✅ WhatsApp message sent successfully. SID: ${message.sid}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send WhatsApp message:', error);
    
    // Log specific Twilio error details
    if (error.code) {
      console.error('Twilio Error Code:', error.code);
      console.error('Twilio Error Message:', error.message);
      
      // Handle specific Twilio errors
      switch (error.code) {
        case 21211:
          console.error('Invalid phone number format');
          break;
        case 21214:
          console.error('Phone number not verified for WhatsApp');
          break;
        case 21215:
          console.error('WhatsApp number not found');
          break;
        default:
          console.error('Unknown Twilio error');
      }
    }
    
    throw new Error(`WhatsApp sending failed: ${error.message}`);
  }
}

function verifyCode(phone, code) {
  console.log(`🔍 Verifying code for ${phone}: ${code}`);
  
  const entry = phoneVerifications[phone];
  if (!entry) {
    console.log(`❌ No verification found for ${phone}`);
    return false;
  }
  
  if (Date.now() > entry.expires) {
    console.log(`⏰ Code expired for ${phone}`);
    delete phoneVerifications[phone];
    return false;
  }
  
  if (entry.code !== code) {
    entry.attempts = (entry.attempts || 0) + 1;
    console.log(`❌ Invalid code for ${phone}. Attempt ${entry.attempts}`);
    
    // Delete after 3 failed attempts
    if (entry.attempts >= 3) {
      console.log(`🚫 Too many failed attempts for ${phone}. Deleting verification.`);
      delete phoneVerifications[phone];
    }
    return false;
  }
  
  console.log(`✅ Code verified successfully for ${phone}`);
  delete phoneVerifications[phone];
  return true;
}

// Clean up expired verifications periodically
setInterval(() => {
  const now = Date.now();
  let cleaned = 0;
  
  Object.keys(phoneVerifications).forEach(phone => {
    if (phoneVerifications[phone].expires < now) {
      delete phoneVerifications[phone];
      cleaned++;
    }
  });
  
  if (cleaned > 0) {
    console.log(`🧹 Cleaned up ${cleaned} expired verifications`);
  }
}, 60000); // Check every minute

module.exports = { sendVerificationCode, verifyCode }; 