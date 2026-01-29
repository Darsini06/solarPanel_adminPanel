import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token') || 
                      localStorage.getItem('token') || 
                      localStorage.getItem('access_token') ||
                      sessionStorage.getItem('auth_token') ||
                      sessionStorage.getItem('token') ||
                      sessionStorage.getItem('access_token');
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // If 401 and not already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const refreshToken = localStorage.getItem('refresh_token') || 
                                    sessionStorage.getItem('refresh_token');
                
                if (refreshToken) {
                    const response = await axios.post(`${API_URL}/api/refresh`, {
                        refresh_token: refreshToken
                    });
                    
                    const newToken = response.data.access_token;
                    localStorage.setItem('auth_token', newToken);
                    localStorage.setItem('token', newToken);
                    
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                // Clear all auth data
                ['auth_token', 'token', 'access_token', 'refresh_token', 'user_name', 'user_email', 'user_id'].forEach(key => {
                    localStorage.removeItem(key);
                    sessionStorage.removeItem(key);
                });
                
                // Redirect to login if not already there
                if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
        }
        
        return Promise.reject(error);
    }
);

export const authAPI = {
    // Auth endpoints - these are correct with /api prefix
    register: (userData) => api.post('/api/register', userData),
    login: (credentials) => api.post('/api/login', credentials),
    getProfile: () => api.get('/api/profile'),
    verifyToken: () => api.get('/api/verify-token'),
    logout: () => api.post('/api/logout'),
    
    // Drive Links endpoints
    saveLinks: (data) => api.post('/drive-links/', data),
    getMyLinks: () => api.get('/drive-links/my-links'),
    getMyLinksWithPDFs: () => api.get('/drive-links/my-links-with-pdfs'),
    getAllLinks: () => api.get('/drive-links/'),
    getUserLinks: (userId) => api.get(`/drive-links/user/${userId}`),
    
  uploadPDF: async (formData) => {
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        const response = await fetch(`${API_URL}/drive-links/upload-pdf`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to upload PDF');
        }
        
        return await response.json();
    },
   // In api.js, add this method:

getPDFsForMyLinks: async () => {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    
    try {
        // First, get user's links
        const linksResponse = await api.get('/drive-links/my-links');
        const links = linksResponse.data || [];
        
        // For each link, get its PDFs
        const allPDFs = [];
        for (const link of links) {
            try {
                const response = await fetch(`${API_URL}/drive-links/pdfs/by-link-user/${link.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.ok) {
                    const pdfs = await response.json();
                    allPDFs.push(...pdfs.map(pdf => ({
                        ...pdf,
                        link_info: link // Include link info for reference
                    })));
                }
            } catch (err) {
                console.log(`No PDFs for link ${link.id}:`, err.message);
            }
        }
        
        return allPDFs;
        
    } catch (err) {
        console.error("Error fetching PDFs for user links:", err);
        throw err;
    }
},

 getAllMyPDFs: async () => {
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        
        try {
            console.log("Fetching all PDFs for current user...");
            
            // Try multiple endpoints
            const endpoints = [
                '/drive-links/pdfs/my-pdfs',
                '/drive-links/my-links-with-pdfs'
            ];
            
            let allPDFs = [];
            
            for (const endpoint of endpoints) {
                try {
                    const response = await fetch(`${API_URL}${endpoint}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        console.log(`Endpoint ${endpoint} returned:`, data.length || 0, "items");
                        
                        if (Array.isArray(data)) {
                            // Handle regular PDF array
                            allPDFs.push(...data);
                        } else if (data.pdfs && Array.isArray(data.pdfs)) {
                            // Handle my-links-with-pdfs format
                            allPDFs.push(...data.pdfs);
                        } else if (data.length > 0 && data[0].pdfs) {
                            // Handle nested PDFs in links
                            data.forEach(link => {
                                if (link.pdfs && Array.isArray(link.pdfs)) {
                                    allPDFs.push(...link.pdfs);
                                }
                            });
                        }
                    }
                } catch (err) {
                    console.log(`Error with endpoint ${endpoint}:`, err.message);
                }
            }
            
            // Remove duplicates
            const uniquePDFs = Array.from(
                new Map(allPDFs.map(pdf => [pdf.pdf_id || pdf._id || pdf.file_id, pdf])).values()
            );
            
            console.log("Total unique PDFs found:", uniquePDFs.length);
            return uniquePDFs;
            
        } catch (err) {
            console.error("Error fetching all user PDFs:", err);
            throw err;
        }
    },
    downloadPDF: async (pdf_id) => {
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        const response = await fetch(`${API_URL}/drive-links/pdf/download/${pdf_id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to download PDF');
        }
        
        return await response.blob();
    },
    getLinkPDFs: (linkId) => api.get(`/drive-links/${linkId}/pdfs`),
    getMyPDFs: () => api.get('/drive-links/pdfs/my-pdfs'),
    getAllPDFs: () => api.get('/drive-links/pdfs/all'),
    
    // Download PDF
    downloadPDF: (pdfId) => {
        return api.get(`/drive-links/pdf/${pdfId}`, {
            responseType: 'blob',
        });
    },
    
    // Helper function to check authentication
    isAuthenticated: () => {
        if (typeof window === 'undefined') return false;
        
        const token = localStorage.getItem('auth_token') || 
                      localStorage.getItem('token') || 
                      localStorage.getItem('access_token');
        return !!token;
    },
    
    // Get current user info - UPDATED
    getCurrentUser: () => {
        if (typeof window === 'undefined') return null;
        
        const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
        if (!token) return null;
        
        try {
            // Try to decode token to get user ID
            const payload = JSON.parse(atob(token.split('.')[1]));
            const userId = payload.sub || '';
            
            return {
                id: userId || localStorage.getItem('user_id') || '',
                name: localStorage.getItem('user_name') || 'User',
                email: localStorage.getItem('user_email') || ''
            };
        } catch (err) {
            // Fallback to localStorage
            return {
                id: localStorage.getItem('user_id') || '',
                name: localStorage.getItem('user_name') || 'User',
                email: localStorage.getItem('user_email') || ''
            };
        }
    },
    
    // Set user data - UPDATED
    setUserData: (data) => {
        if (typeof window === 'undefined') return;
        
        if (data.access_token) {
            localStorage.setItem('auth_token', data.access_token);
            localStorage.setItem('token', data.access_token);
        }
        if (data.refresh_token) {
            localStorage.setItem('refresh_token', data.refresh_token);
        }
        if (data.user) {
            // Make sure to save the user ID correctly
            localStorage.setItem('user_id', data.user.id || '');
            localStorage.setItem('user_name', `${data.user.first_name || ''} ${data.user.last_name || ''}`.trim() || 'User');
            localStorage.setItem('user_email', data.user.email || '');
        }
    },
    
    // Clear all auth data
    clearAuthData: () => {
        if (typeof window === 'undefined') return;
        
        ['auth_token', 'token', 'access_token', 'refresh_token', 'user_id', 'user_name', 'user_email'].forEach(key => {
            localStorage.removeItem(key);
            sessionStorage.removeItem(key);
        });
    }
};

export default api;