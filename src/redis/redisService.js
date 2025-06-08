// Enhanced RedisService.js with comprehensive Vercel debugging
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
    
    // Enhanced logging for debugging
    console.log('🔧 RedisService Configuration:', {
      hasUrl: !!this.baseUrl,
      hasToken: !!this.token,
      urlPreview: this.baseUrl ? `${this.baseUrl.substring(0, 30)}...` : 'missing',
      tokenPreview: this.token ? `${this.token.substring(0, 10)}...` : 'missing',
      isConfigured: this.isConfigured,
      environment: typeof window !== 'undefined' ? 'browser' : 'server',
      platform: typeof process !== 'undefined' ? process.env.VERCEL ? 'vercel' : 'local' : 'unknown'
    });
    
    if (!this.isConfigured) {
      console.warn('⚠️ Redis not configured - missing URL or token');
      console.warn('Expected environment variables:');
      console.warn('- VITE_UPSTASH_REDIS_REST_URL');
      console.warn('- VITE_UPSTASH_REDIS_REST_TOKEN');
    }
  }

  // Enhanced fetch with better error handling and debugging
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const fetchOptions = {
      method: options.method || 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Add CORS headers for Vercel
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        ...options.headers
      },
      ...options
    };

    console.log(`🌐 Making Redis request to: ${endpoint}`);
    console.log(`🔍 Request details:`, {
      method: fetchOptions.method,
      url: url,
      hasAuth: !!fetchOptions.headers.Authorization,
      headers: Object.keys(fetchOptions.headers)
    });

    try {
      const response = await fetch(url, fetchOptions);
      
      console.log(`📡 Response status: ${response.status}`);
      console.log(`🏷️ Response headers:`, Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Request failed:`, {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
          url: url
        });
        throw new Error(`Redis request failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log(`✅ Response data:`, data);
      return data;
    } catch (error) {
      console.error(`❌ Request error:`, {
        message: error.message,
        name: error.name,
        stack: error.stack,
        url: url
      });
      throw error;
    }
  }

  // Enhanced ping with detailed debugging
  async ping() {
    if (!this.isConfigured) {
      console.log('❌ Redis ping failed: Not configured');
      return false;
    }

    try {
      console.log('🏓 Testing Redis ping...');
      
      const data = await this.makeRequest('/ping');
      
      // Handle various ping response formats
      const success = data.result === 'PONG' || 
                     data.result === 1 || 
                     data.result === true ||
                     data === 'PONG';
      
      console.log(`🏓 Redis ping result: ${success ? '✅ PONG' : '❌ Failed'}`);
      return success;
    } catch (error) {
      console.error('❌ Redis ping failed:', error.message);
      
      // Enhanced error diagnosis
      if (error.message.includes('CORS')) {
        console.error('🚨 CORS Error detected - this is likely a Vercel deployment issue');
        console.error('💡 Suggestions:');
        console.error('   1. Ensure you\'re using the correct Upstash REST API URL');
        console.error('   2. Check if your Redis database allows REST API access');
        console.error('   3. Consider using a server-side proxy for Redis calls');
      } else if (error.message.includes('fetch')) {
        console.error('🚨 Fetch Error detected');
        console.error('💡 This might be a network connectivity issue on Vercel');
      } else if (error.message.includes('401') || error.message.includes('403')) {
        console.error('🚨 Authentication Error');
        console.error('💡 Check your VITE_UPSTASH_REDIS_REST_TOKEN');
      }
      
      return false;
    }
  }

  // Enhanced setComments with better error handling
  async setComments(postId, comments, expireInSeconds = 3600) {
    if (!this.isConfigured) {
      console.warn('⚠️ Redis not configured - skipping setComments');
      return false;
    }

    try {
      const key = `comments:${postId}`;
      const value = JSON.stringify({
        comments: Array.isArray(comments) ? comments : [],
        timestamp: Date.now(),
        count: Array.isArray(comments) ? comments.length : 0
      });
      
      console.log(`💾 Setting comments for ${key}, count: ${Array.isArray(comments) ? comments.length : 0}`);
      
      // Use SET with EX parameter
      const endpoint = `/set/${encodeURIComponent(key)}/${encodeURIComponent(value)}?EX=${expireInSeconds}`;
      const data = await this.makeRequest(endpoint);
      
      const success = data.result === 'OK';
      console.log(`💾 Set result: ${success ? '✅ SUCCESS' : '❌ FAILED'}`);
      return success;
    } catch (error) {
      console.error('❌ Redis setComments error:', error.message);
      return false;
    }
  }

  // Enhanced getComments
  async getComments(postId) {
    if (!this.isConfigured) {
      console.warn('⚠️ Redis not configured - skipping getComments');
      return null;
    }

    try {
      const key = `comments:${postId}`;
      console.log(`📦 Getting comments for ${key}`);
      
      const data = await this.makeRequest(`/get/${encodeURIComponent(key)}`, { method: 'GET' });
      
      if (data.result && data.result !== null) {
        const parsed = JSON.parse(data.result);
        console.log(`📦 Retrieved ${parsed.comments?.length || 0} comments from cache`);
        return parsed;
      }
      
      console.log(`📦 No cached data found for ${key}`);
      return null;
    } catch (error) {
      console.error('❌ Redis getComments error:', error.message);
      return null;
    }
  }

  // Enhanced clearCommentsCache
  async clearCommentsCache(postId) {
    if (!this.isConfigured) {
      console.warn('⚠️ Redis not configured - skipping clearCommentsCache');
      return false;
    }

    try {
      const key = `comments:${postId}`;
      console.log(`🗑️ Clearing cache for ${key}`);
      
      const data = await this.makeRequest(`/del/${encodeURIComponent(key)}`);
      
      const success = data.result >= 0;
      console.log(`🗑️ Clear result: ${success ? '✅ SUCCESS' : '❌ FAILED'}`);
      return success;
    } catch (error) {
      console.error('❌ Redis clearCommentsCache error:', error.message);
      return false;
    }
  }

  // Comprehensive connection test
  async testConnection() {
    console.log('🧪 === COMPREHENSIVE REDIS CONNECTION TEST ===');
    
    const results = {
      configuration: false,
      ping: false,
      setGet: false,
      cleanup: false,
      overall: false
    };

    try {
      // 1. Configuration Test
      console.log('1️⃣ Testing Configuration...');
      if (!this.isConfigured) {
        console.log('❌ Configuration failed');
        console.log('   Missing environment variables:');
        if (!this.baseUrl) console.log('   - VITE_UPSTASH_REDIS_REST_URL');
        if (!this.token) console.log('   - VITE_UPSTASH_REDIS_REST_TOKEN');
        return results;
      }
      
      results.configuration = true;
      console.log('✅ Configuration passed');
      console.log(`   URL: ${this.baseUrl}`);
      console.log(`   Token: ${this.token ? '***' + this.token.slice(-4) : 'missing'}`);

      // 2. Ping Test
      console.log('2️⃣ Testing Ping...');
      results.ping = await this.ping();
      if (!results.ping) {
        console.log('❌ Ping failed - aborting further tests');
        return results;
      }
      console.log('✅ Ping passed');

      // 3. Set/Get Test
      console.log('3️⃣ Testing Set/Get operations...');
      const testKey = 'test:connection';
      const testValue = [{ message: 'Hello Redis!', timestamp: Date.now() }];
      
      const setResult = await this.setComments(testKey, testValue, 60);
      if (!setResult) {
        console.log('❌ Set operation failed');
        return results;
      }
      
      const getResult = await this.getComments(testKey);
      results.setGet = !!(getResult && getResult.comments && getResult.comments.length > 0);
      
      if (results.setGet) {
        console.log('✅ Set/Get operations passed');
        console.log(`   Retrieved: ${getResult.comments.length} test items`);
      } else {
        console.log('❌ Set/Get operations failed');
        return results;
      }

      // 4. Cleanup Test
      console.log('4️⃣ Testing Cleanup...');
      results.cleanup = await this.clearCommentsCache(testKey);
      console.log(results.cleanup ? '✅ Cleanup passed' : '❌ Cleanup failed');

      // Overall result
      results.overall = results.configuration && results.ping && results.setGet && results.cleanup;
      console.log(`🏆 Overall test result: ${results.overall ? '✅ SUCCESS' : '❌ FAILED'}`);
      
      return results;
    } catch (error) {
      console.error('❌ Connection test failed:', error.message);
      return results;
    } finally {
      console.log('🧪 === TEST COMPLETE ===');
    }
  }

  // Update cache methods to use the enhanced setComments
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