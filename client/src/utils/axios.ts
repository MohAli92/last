import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Create axios instance with default configuration
const api: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  timeout: 30000, // Increased timeout for WhatsApp operations
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false, // Important for CORS
});

// Request interceptor to add auth token and debug requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Debug logging
    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      headers: config.headers,
      data: config.data
    });
    
    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors and debug responses
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Debug logging
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error: AxiosError) => {
    // Debug logging
    console.error('❌ Response Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message
    });

    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (error.response?.status === 0) {
      // Network error - server not reachable
      console.error('🌐 Network Error: Server is not reachable. Check if server is running on port 5000');
    } else if (error.code === 'ECONNABORTED') {
      console.error('⏰ Request Timeout: Request took too long to complete');
    }
    
    return Promise.reject(error);
  }
);

// Type definitions for better TypeScript support
interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  phone: string;
  phoneVerified: boolean;
  createdAt: string;
}

interface Post {
  _id: string;
  photo: string;
  ingredients: string[];
  allergies: string[];
  city: string;
  address: string;
  time: string;
  description: string;
  reserved: boolean;
  user?: User;
}

interface Chat {
  _id: string;
  post: {
    _id: string;
    title: string;
    photo: string;
  };
  users: User[];
  messages: Array<{
    sender: User;
    text: string;
    createdAt: string;
  }>;
}

// API endpoints with proper typing
export const authAPI = {
  signin: (email: string, password: string): Promise<AxiosResponse<{ user: User; token: string }>> => 
    api.post('/api/auth/signin', { email, password }),
  
  signup: (userData: any): Promise<AxiosResponse<{ user: User; token: string }>> => 
    api.post('/api/auth/signup', userData),
  
  profile: (): Promise<AxiosResponse<User>> => 
    api.get('/api/auth/profile'),
  
  sendWhatsAppCode: (phone: string): Promise<AxiosResponse<any>> => 
    api.post('/api/auth/send-whatsapp-code', { phone }),
  
  verifyWhatsAppCode: (phone: string, code: string): Promise<AxiosResponse<any>> => 
    api.post('/api/auth/verify-whatsapp-code', { phone, code }),
};

export const postsAPI = {
  getAll: (): Promise<AxiosResponse<Post[]>> => 
    api.get('/api/posts'),
  
  getById: (id: string): Promise<AxiosResponse<Post>> => 
    api.get(`/api/posts/${id}`),
  
  create: (postData: any): Promise<AxiosResponse<Post>> => 
    api.post('/api/posts', postData),
  
  update: (id: string, postData: any): Promise<AxiosResponse<Post>> => 
    api.patch(`/api/posts/${id}`, postData),
  
  delete: (id: string): Promise<AxiosResponse<any>> => 
    api.delete(`/api/posts/${id}`),
  
  reserve: (id: string): Promise<AxiosResponse<Post>> => 
    api.patch(`/api/posts/${id}/reserve`),
  
  upload: (formData: FormData): Promise<AxiosResponse<{ url: string }>> => 
    api.post('/api/posts/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
};

export const usersAPI = {
  getById: (id: string): Promise<AxiosResponse<User>> => 
    api.get(`/api/users/${id}`),
  
  update: (id: string, userData: Partial<User>): Promise<AxiosResponse<User>> => 
    api.put(`/api/users/${id}`, userData),
  
  delete: (id: string): Promise<AxiosResponse<any>> => 
    api.delete(`/api/users/${id}`),
};

export const chatAPI = {
  getUserChats: (userId: string): Promise<AxiosResponse<Chat[]>> => 
    api.get(`/api/chat/user/${userId}`),
  
  getChat: (postId: string, userId1: string, userId2: string): Promise<AxiosResponse<any[]>> => 
    api.get(`/api/chat/${postId}/${userId1}/${userId2}`),
  
  startChat: (postId: string, userId1: string, userId2: string): Promise<AxiosResponse<Chat>> => 
    api.post('/api/chat/start', { postId, userId1, userId2 }),
  
  sendMessage: (postId: string, sender: string, receiver: string, text: string): Promise<AxiosResponse<any>> => 
    api.post(`/api/chat/${postId}/message`, { sender, receiver, text }),
};

export const messagesAPI = {
  getUnreadCount: (userId: string): Promise<AxiosResponse<{ count: number }>> => 
    api.get(`/api/messages/unread/${userId}`),
};

export default api; 