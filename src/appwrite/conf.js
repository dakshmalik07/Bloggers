import config from "../config/config";
import { Client,ID ,Databases, Storage,  Query} from "appwrite";

export class DatabaseService {
    Client = new Client();
    databaseService;
    bucket;

    constructor() {
        this.Client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId);
        this.databaseService = new Databases(this.Client);
        this.bucket = new Storage(this.Client);
    }

    async createPost({title, slug , content, featuredImage,status,userId}) {
        try {
            const post = await this.databaseService.createDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                ID.unique(),
                {
                    title,
                    slug,
                    content,
                    featuredImage,
                    status,
                    userId
                }
            );
            return post;
        } catch (error) {
            console.error("Error creating post:", error);
            throw error;
        }  

    }

    
async updatePost(postId, {title, slug, content, featuredImage, status}) {
    try {
        const post = await this.databaseService.updateDocument(
            config.appwriteDatabaseId,
            config.appwriteCollectionId,
            postId,
            {
                title,
                slug,
                content,
                featuredImage,
                status
            }
        );
        return post;
    } catch (error) {
        console.error("Error updating post:", error);
        throw error;
    }     
} 

    async deletePost(slug){
        try {
            const post = await this.databaseService.deleteDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug
            );
            return post;
        } catch (error) {
            console.error("Error deleting post:", error);
            throw error;
        }     
    }

    async getPost(slug) {
        try {
            const posts = await this.databaseService.getDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug
            );
            return posts;
        } catch (error) {
            console.error("Error getting posts:", error);
            throw error;
        }     
    }

    async getPosts(quries = [Query.equal("status", "active")]) {
        try {
            const posts = await this.databaseService.listDocuments(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                quries
            );
            return posts;
        } catch (error) {
            console.error("Error getting posts:", error);
            throw error;
        }     
       
    }


    async uploadFile(file){
        try {
            return await this.bucket.createFile(
                config.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Appwrite serive :: uploadFile :: error", error);
            return false
        }
    }

    async deleteFile(fileId) {  
        try {
            const fileDeleted = await this.bucket.deleteFile(
                config.appwriteBucketId,
                fileId
            );
            return true;
        } catch (error) {
            console.error("Error deleting file:", error);
            throw false;
        }
    }  

    async getFilePreview(fileId) {
        try {
            if (!fileId) {
                console.error("No file ID provided for preview");
                return null;
            }
            
            console.log("Getting preview for file ID:", fileId);
            
            // Generate the URL without actually fetching the file
            const url = this.bucket.getFileView(
                config.appwriteBucketId,
                fileId
            );
            
            console.log("Generated preview URL:", url);
            return url;
        } catch (error) {
            console.error("Error generating file preview URL:", error);
            throw error;
        }
    }


    // New comment methods - FIXED to return proper array structure
    async createComment({postId, userId, userName, content}) {
        try {
            const comment = await this.databaseService.createDocument(
                config.appwriteDatabaseId,
                config.appwriteCommentsCollectionId,
                ID.unique(),
                {
                    postId,
                    userId,
                    userName,
                    content
                }
            );
            return comment;
        } catch (error) {
            console.error("Error creating comment:", error);
            throw error;
        }
    }

    async getComments(postId) {
        try {
            const response = await this.databaseService.listDocuments(
                config.appwriteDatabaseId,
                config.appwriteCommentsCollectionId,
                [
                    Query.equal("postId", postId),
                    Query.orderDesc("$createdAt") // Show newest comments first
                ]
            );
            
            // Return the documents array, not the whole response object
            return response.documents || [];
        } catch (error) {
            console.error("Error getting comments:", error);
            // Return empty array on error to prevent map() issues
            return [];
        }
    }

    async deleteComment(commentId) {
        try {
            await this.databaseService.deleteDocument(
                config.appwriteDatabaseId,
                config.appwriteCommentsCollectionId,
                commentId
            );
            return true;
        } catch (error) {
            console.error("Error deleting comment:", error);
            throw error;
        }
    }
}

const databaseService = new DatabaseService();
export default databaseService;