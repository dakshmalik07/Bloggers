// Fixed RedisService.js for Upstash REST API
import config from "../config/config";

class RedisService {
  constructor() {
    this.baseUrl = config.redisUrl;
    this.token = config.redisToken;
    
    // Clean up the base URL if it has trailing slash
    if (this.baseUrl && this.baseUrl.endsWith('/')) {
      this.baseUrl = this.baseUrl.slice(0, -1);
    }
    
    // Validate configuration
    this.isConfigured = !!(this.baseUrl && this.token);
    
    if (!this.isConfigured) {
      console.warn('⚠️ Redis not configured - missing URL or token');
    }
  }

  // Fixed: Use individual command endpoints instead of generic command approach
  async ping() {
    if (!this.isConfigured) {
      console.log('❌ Redis ping failed: Not configured');
      return false;
    }

    try {
      console.log('🏓 Testing Redis ping...');
      
      const response = await fetch(`${this.baseUrl}/ping`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Ping failed: ${response.status}`);
      }

      const data = await response.json();
      console.log(`🔍 Redis ping response:`, data);
      
      // Handle various ping response formats
      const success = data.result === 'PONG' || 
                     data.result === 1 || 
                     data.result === true ||
                     data === 'PONG' ||
                     response.ok;
      
      console.log(`🏓 Redis ping result: ${success ? '✅ PONG' : '❌ Failed'}`);
      return success;
    } catch (error) {
      console.error('❌ Redis ping failed:', error.message);
      return false;
    }
  }

  // Fixed: Use SET with EX parameter instead of SETEX
  async setComments(postId, comments, expireInSeconds = 3600) {
    try {
      const key = `comments:${postId}`;
      const value = JSON.stringify({
        comments: Array.isArray(comments) ? comments : [],
        timestamp: Date.now(),
        count: Array.isArray(comments) ? comments.length : 0
      });
      
      // Use SET with EX parameter instead of SETEX
      const response = await fetch(`${this.baseUrl}/set/${encodeURIComponent(key)}/${encodeURIComponent(value)}?EX=${expireInSeconds}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Redis SET failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data.result === 'OK';
    } catch (error) {
      console.error('❌ Redis setComments error:', error.message);
      return false;
    }
  }

  // Fixed: Use GET endpoint
  async getComments(postId) {
    try {
      const key = `comments:${postId}`;
      
      const response = await fetch(`${this.baseUrl}/get/${encodeURIComponent(key)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null; // Key doesn't exist
        }
        throw new Error(`Redis GET failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.result && data.result !== null) {
        return JSON.parse(data.result);
      }
      return null;
    } catch (error) {
      console.error('❌ Redis getComments error:', error.message);
      return null;
    }
  }

  // Fixed: Use DEL endpoint
  async clearCommentsCache(postId) {
    try {
      const key = `comments:${postId}`;
      
      const response = await fetch(`${this.baseUrl}/del/${encodeURIComponent(key)}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Redis DEL failed: ${response.status}`);
      }

      const data = await response.json();
      return data.result >= 0;
    } catch (error) {
      console.error('❌ Redis clearCommentsCache error:', error.message);
      return false;
    }
  }

  // Update cache methods to use the fixed setComments
  async addCommentToCache(postId, newComment) {
    try {
      const cachedData = await this.getComments(postId);
      if (cachedData?.comments) {
        const updatedComments = [newComment, ...cachedData.comments];
        return await this.setComments(postId, updatedComments);
      }
      return await this.setComments(postId, [newComment]);
    } catch (error) {
      console.error('❌ Redis addCommentToCache error:', error.message);
      return false;
    }
  }

  async removeCommentFromCache(postId, commentId) {
    try {
      const cachedData = await this.getComments(postId);
      if (cachedData?.comments) {
        const updatedComments = cachedData.comments.filter(
          comment => comment.$id !== commentId
        );
        return await this.setComments(postId, updatedComments);
      }
      return false;
    } catch (error) {
      console.error('❌ Redis removeCommentFromCache error:', error.message);
      return false;
    }
  }
}

const redisService = new RedisService();
export default redisService;