export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export const UPLOADS_URL = `${API_BASE_URL}/uploads`;

// Pixabay API Configuration
export const PIXABAY_API_URL = 'https://pixabay.com/api/';
export const PIXABAY_API_KEY = import.meta.env.VITE_PIXABAY_API_KEY || '45660373-21fab531bb6d69e7c59ac931d';