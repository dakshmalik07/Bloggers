
// Fixed config.js - Remove debug console.logs and fix configuration
const config = {
    appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
    appwriteCommentsCollectionId: String(import.meta.env.VITE_APPWRITE_COMMENTS_COLLECTION_ID),
    appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),

    // Fixed Redis configuration
    redisUrl: String(import.meta.env.VITE_UPSTASH_REDIS_REST_URL || ''),
    redisToken: String(import.meta.env.VITE_UPSTASH_REDIS_REST_TOKEN || ''),
}

export default config;

