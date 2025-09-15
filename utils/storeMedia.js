const axios = require('axios');
const FormData = require('form-data');
const dotenv = require('dotenv');
dotenv.config({ path: "./config.env" });

class MediaApiClient {
  constructor(baseURL = process.env.MEDIA_URL) {
    this.client = axios.create({
      baseURL: baseURL,
      timeout: 300000, // 5 minutes timeout for large files
      maxContentLength: 2 * 1024 * 1024 * 1024, // 2GB
      maxBodyLength: 2 * 1024 * 1024 * 1024, // 2GB
    });

    // Request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
        if (config.data instanceof FormData) {
          console.log('📎 Form data with files attached');
        }
        return config;
      },
      (error) => {
        console.error('❌ Request error:', error.message);
        return Promise.reject(error);
      }
    );

    // Response interceptor for logging
    this.client.interceptors.response.use(
      (response) => {
        console.log(`✅ ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error(`❌ ${error.response?.status || 'Network Error'} ${error.config?.url}`);
        console.error('Error details:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Upload a single media file
   * @param {Buffer|File} file - Buffer or File object
   * @param {Object} options - Upload options
   * @param {Function} onProgress - Progress callback function
   * @returns {Promise<Object>} Upload response
   */
  async uploadSingle(file, options = {}, onProgress = null) {
    try {
      const formData = new FormData();

      // Handle different file input types
      if (Buffer.isBuffer(file)) {
        // Buffer
        const fileName = options.fileName || `file_${Date.now()}`;
        formData.append('media', file, fileName);
      } else if (file instanceof File || (file && file.stream)) {
        // File object (browser) or stream-like object
        formData.append('media', file, options.fileName || file.name || 'uploaded_file');
      } else {
        throw new Error('Invalid file input. Use buffer or File object.');
      }

      const config = {
        headers: {
          ...formData.getHeaders?.(), // Node.js FormData headers
          ...options.headers
        }
      };

      // Add progress tracking if callback provided
      if (onProgress && typeof onProgress === 'function') {
        config.onUploadProgress = (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress({
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percent: percentCompleted
          });
        };
      }

      const response = await this.client.post('/api/media/upload', formData, config);
      return response.data;

    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Upload multiple media files
   * @param {Array} files - Array of buffers or File objects
   * @param {Object} options - Upload options
   * @param {Function} onProgress - Progress callback function
   * @returns {Promise<Object>} Upload response
   */
  async uploadMultiple(files, options = {}, onProgress = null) {
    try {
      if (!Array.isArray(files) || files.length === 0) {
        throw new Error('Files must be a non-empty array');
      }

      if (files.length > 10) {
        throw new Error('Maximum 10 files allowed per upload');
      }

      const formData = new FormData();

      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (Buffer.isBuffer(file)) {
          // Buffer
          const fileName = options.fileNames?.[i] || `file_${Date.now()}_${i}`;
          formData.append('media', file, fileName);

        } else if (file instanceof File || (file && file.stream)) {
          // File object
          const fileName = options.fileNames?.[i] || file.name || `uploaded_file_${i}`;
          formData.append('media', file, fileName);

        } else {
          throw new Error(`Invalid file at index ${i}. Use buffer or File object.`);
        }
      }

      const config = {
        headers: {
          ...formData.getHeaders?.(), // Node.js FormData headers
          ...options.headers
        }
      };

      // Add progress tracking if callback provided
      if (onProgress && typeof onProgress === 'function') {
        config.onUploadProgress = (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress({
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percent: percentCompleted,
            filesCount: files.length
          });
        };
      }

      const response = await this.client.post('/api/media/upload/multiple', formData, config);
      return response.data;

    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get a specific media file
   * @param {string} filename - File name to retrieve
   * @param {Object} options - Request options
   * @returns {Promise<Buffer>} File data as buffer
   */
  async getFile(filename, options = {}) {
    try {
      const response = await this.client.get(`/api/media/file/${filename}`, {
        responseType: 'arraybuffer',
        ...options
      });
      return Buffer.from(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get files by specific date
   * @param {string} year - Year (YYYY)
   * @param {string} month - Month (MM)
   * @param {string} day - Day (DD)
   * @returns {Promise<Object>} Files list response
   */
  async getFilesByDate(year, month, day) {
    try {
      const response = await this.client.get(`/api/media/files/${year}/${month}/${day}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get all files with pagination
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 10)
   * @returns {Promise<Object>} Paginated files response
   */
  async getAllFiles(params = {}) {
    try {
      const response = await this.client.get('/api/media/files', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete a specific media file
   * @param {string} filename - File name to delete
   * @returns {Promise<Object>} Delete response
   */
  async deleteFile(filename) {
    try {
      const response = await this.client.delete(`/api/media/file/${filename}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get API health status
   * @returns {Promise<Object>} API status
   */
  async getStatus() {
    try {
      const response = await this.client.get('/');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle and format errors
   * @param {Error} error - Original error
   * @returns {Error} Formatted error
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const serverError = new Error(error.response.data?.error || error.response.statusText);
      serverError.status = error.response.status;
      serverError.data = error.response.data;
      return serverError;
    } else if (error.request) {
      // Network error
      return new Error('Network error: Unable to reach server');
    } else {
      // Other error
      return error;
    }
  }
}

// Export the class and a default instance
const mediaApi = new MediaApiClient();

module.exports = {
  MediaApiClient,
  mediaApi
};