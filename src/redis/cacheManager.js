
import redisService from './redisService';
import databaseService from '../appwrite/conf';

class CacheManager {
  constructor() {
    this.defaultTTL = 3600;
    this.isRedisHealthy = false; // Start as false, check on init
    this.debugMode = true;
    this.healthCheckInterval = null;
    this.lastHealthCheck = 0;
    this.healthCheckCooldown = 30000; // 30 seconds
  }

  log(message, data = null) {
    if (this.debugMode) {
      console.log(`🔧 CacheManager: ${message}`, data || '');
    }
  }

  async checkRedisHealth() {
    const now = Date.now();
    
    // Don't check too frequently
    if (now - this.lastHealthCheck < this.healthCheckCooldown) {
      this.log(`Skipping health check (cooldown: ${Math.round((this.healthCheckCooldown - (now - this.lastHealthCheck)) / 1000)}s)`);
      return this.isRedisHealthy;
    }

    try {
      this.log('🏥 Checking Redis health...');
      this.lastHealthCheck = now;
      
      const isHealthy = await redisService.ping();
      this.isRedisHealthy = isHealthy;
      
      this.log(`🏥 Redis health check: ${isHealthy ? '✅ HEALTHY' : '❌ UNHEALTHY'}`);
      
      // If unhealthy, try to diagnose the issue
      if (!isHealthy) {
        this.log('🔍 Diagnosing Redis connection issues...');
        if (!redisService.isConfigured) {
          this.log('❓ Redis is not configured (missing URL or token)');
        }
      }
      
      return isHealthy;
    } catch (error) {
      this.log('❌ Redis health check failed:', error.message);
      this.isRedisHealthy = false;
      this.lastHealthCheck = now;
      return false;
    }
  }

  async getCommentsWithCache(postId, options = {}) {
    const { forceRefresh = false } = options;
    this.log(`Getting comments for post ${postId}, forceRefresh: ${forceRefresh}`);

    try {
      // Check Redis health if it's been marked unhealthy
      if (!this.isRedisHealthy) {
        await this.checkRedisHealth();
      }

      // Try cache first (unless force refresh)
      if (!forceRefresh && this.isRedisHealthy) {
        this.log('📦 Attempting to fetch from Redis cache...');
        const cachedData = await redisService.getComments(postId);
        
        if (cachedData?.comments) {
          this.log(`✅ Cache HIT! Found ${cachedData.comments.length} comments in cache`);
          return {
            data: cachedData.comments,
            fromCache: true,
            timestamp: cachedData.timestamp
          };
        } else {
          this.log('❌ Cache MISS - no data found in cache');
        }
      } else {
        const reason = forceRefresh ? 'Force refresh requested' : 'Redis unhealthy';
        this.log(`⏭️ ${reason} - skipping cache`);
      }

      // Fetch from database
      this.log('📁 Fetching comments from database...');
      const commentsFromDB = await databaseService.getComments(postId);
      this.log(`📁 Database returned ${commentsFromDB?.length || 0} comments`);
      
      // Try to cache (silently fail if it doesn't work)
      if (commentsFromDB && this.isRedisHealthy) {
        this.log('💾 Attempting to cache database results...');
        try {
          const cached = await redisService.setComments(postId, commentsFromDB, this.defaultTTL);
          this.log(cached ? '✅ Successfully cached to Redis' : '❌ Failed to cache to Redis');
        } catch (error) {
          this.log('❌ Failed to cache to Redis:', error.message);
          // Mark Redis as unhealthy if caching fails
          this.isRedisHealthy = false;
        }
      }
      
      return {
        data: commentsFromDB || [],
        fromCache: false,
        timestamp: Date.now()
      };
      
    } catch (error) {
      this.log('❌ Error in getCommentsWithCache:', error.message);
      throw error;
    }
  }

  // Add method to manually test Redis with detailed logging
  async testRedisConnection() {
    this.log('🧪 === REDIS CONNECTION TEST ===');
    
    try {
      // Check configuration first
      if (!redisService.isConfigured) {
        this.log('❌ Redis is not configured');
        this.log('   Missing environment variables:');
        if (!redisService.baseUrl) this.log('   - VITE_UPSTASH_REDIS_REST_URL');
        if (!redisService.token) this.log('   - VITE_UPSTASH_REDIS_REST_TOKEN');
        return false;
      }

      this.log('✅ Redis configuration found');
      this.log(`   URL: ${redisService.baseUrl}`);
      this.log(`   Token: ${redisService.token ? '***' + redisService.token.slice(-4) : 'missing'}`);

      // Test ping
      this.log('🏓 Testing PING...');
      const pingResult = await redisService.ping();
      this.log(`   Result: ${pingResult ? '✅ SUCCESS' : '❌ FAILED'}`);
      
      if (!pingResult) {
        this.log('❌ Redis ping failed - connection test aborted');
        return false;
      }

      // Test set/get
      const testKey = 'test:connection:' + Date.now();
      const testValue = [{ message: 'Hello Redis!', timestamp: Date.now() }];
      
      this.log('💾 Testing SET operation...');
      const setResult = await redisService.setComments('test:connection', testValue, 60);
      this.log(`   Result: ${setResult ? '✅ SUCCESS' : '❌ FAILED'}`);
      
      if (setResult) {
        this.log('📦 Testing GET operation...');
        const getResult = await redisService.getComments('test:connection');
        const getSuccess = getResult && getResult.comments && getResult.comments.length > 0;
        this.log(`   Result: ${getSuccess ? '✅ SUCCESS' : '❌ FAILED'}`);
        
        if (getSuccess) {
          this.log(`   Retrieved: ${getResult.comments.length} test items`);
        }
        
        // Cleanup
        this.log('🧹 Cleaning up test data...');
        await redisService.clearCommentsCache('test:connection');
        this.log('   Cleanup completed');
        
        return getSuccess;
      }
      
      return false;
    } catch (error) {
      this.log('❌ Redis connection test failed:', error.message);
      return false;
    } finally {
      this.log('🧪 === TEST COMPLETE ===');
    }
  }

  // Add comment with cache update
  async addCommentWithCache(postId, commentData) {
    try {
      // Create comment in database first
      const newComment = await databaseService.createComment(commentData);
      
      // Try to update cache (silently fail if it doesn't work)
      if (this.isRedisHealthy) {
        const updated = await redisService.addCommentToCache(postId, newComment);
        this.log(updated ? '✅ Cache updated with new comment' : '❌ Failed to update cache');
      }
      
      return newComment;
    } catch (error) {
      this.log('❌ Error in addCommentWithCache:', error.message);
      throw error;
    }
  }

  // Delete comment with cache update
  async deleteCommentWithCache(postId, commentId) {
    try {
      // Delete from database first
      await databaseService.deleteComment(commentId);
      
      // Try to update cache (silently fail if it doesn't work)
      if (this.isRedisHealthy) {
        const updated = await redisService.removeCommentFromCache(postId, commentId);
        this.log(updated ? '✅ Cache updated after comment deletion' : '❌ Failed to update cache');
      }
      
      return true;
    } catch (error) {
      this.log('❌ Error in deleteCommentWithCache:', error.message);
      throw error;
    }
  }

  // Initialize with better error handling
  async initialize() {
    this.log('🚀 Initializing CacheManager...');
    
    try {
      await this.checkRedisHealth();
      
      // Set up periodic health checks if Redis is configured
      if (redisService.isConfigured) {
        this.log('⏰ Setting up periodic Redis health checks...');
        this.healthCheckInterval = setInterval(() => {
          this.checkRedisHealth();
        }, 60000); // Check every minute
      }
      
      this.log('✅ CacheManager initialized successfully');
    } catch (error) {
      this.log('❌ CacheManager initialization failed:', error.message);
    }
  }

  // Cleanup method
  destroy() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }
}

const cacheManager = new CacheManager();
export default cacheManager;