import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import databaseService from "../appwrite/conf";
import { Button, Container, Comments } from "../components";
import parse from "html-react-parser";
import { useSelector, useDispatch } from "react-redux";
import config from "../config/config";
import { setCurrentPost, clearCurrentPost } from "../store/postSlice";
import { clearComments } from "../store/commentsSlice";

export default function Post() {
    // Local component state (only for UI elements)
    const [loading, setLoading] = useState(true);
    const [imageUrl, setImageUrl] = useState(null);
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);
    
    // Router hooks
    const { slug } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux state
    const currentPost = useSelector((state) => state.posts.currentPost);
    const userData = useSelector((state) => state.auth.userData);

    // Derived state
    const isAuthor = currentPost && userData ? currentPost.userId === userData.$id : false;

    // Reset UI states when slug changes
    useEffect(() => {
        setLoading(true);
        setImageUrl(null);
        setImageError(false);
        setImageLoading(true);
    }, [slug]);

    // Load post data
    useEffect(() => {
        let isMounted = true;
        
        const fetchPostData = async () => {
            if (!slug) {
                navigate("/");
                return;
            }

            // If we already have the correct post, just update UI states
            if (currentPost && currentPost.$id === slug) {
                if (isMounted) {
                    setLoading(false);
                    // Don't reset imageLoading here, the image useEffect will handle it
                }
                return;
            }

            try {
                const post = await databaseService.getPost(slug);
                
                if (!post || !isMounted) {
                    if (isMounted) {
                        console.log("No post found with slug:", slug);
                        navigate("/");
                    }
                    return;
                }
                
                dispatch(setCurrentPost(post));
                
                if (isMounted) {
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching post:", error);
                if (isMounted) {
                    navigate("/");
                }
            }
        };
        
        fetchPostData();
        
        return () => {
            isMounted = false;
        };
    }, [slug, navigate, dispatch]);

    // Load image when post changes
    useEffect(() => {
        let isMounted = true;
        
        const loadImage = async () => {
            if (!currentPost || !currentPost.featuredImage) {
                if (isMounted) {
                    setImageLoading(false);
                }
                return;
            }
            
            setImageLoading(true);
            setImageError(false);
            
            try {
                const url = await databaseService.getFilePreview(currentPost.featuredImage);
                if (isMounted) {
                    setImageUrl(url);
                    setImageLoading(false);
                }
            } catch (error) {
                console.error("Error getting file preview:", error);
                if (isMounted) {
                    setImageError(true);
                    setImageLoading(false);
                    
                    // Fallback to direct URL construction
                    const directUrl = `${config.appwriteUrl}/storage/buckets/${config.appwriteBucketId}/files/${currentPost.featuredImage}/view?project=${config.appwriteProjectId}`;
                    setImageUrl(directUrl);
                }
            }
        };
        
        if (currentPost) {
            loadImage();
        }
        
        return () => {
            isMounted = false;
        };
    }, [currentPost]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            // Only clear when actually unmounting the component, not on re-renders
            if (!slug) {
                dispatch(clearCurrentPost());
                dispatch(clearComments());
            }
        };
    }, [dispatch, slug]);

    const deletePost = async () => {
        if (!currentPost) return;
        
        try {
            const status = await databaseService.deletePost(currentPost.$id);
            
            if (status) {
                // Delete the associated file if exists
                if (currentPost.featuredImage) {
                    await databaseService.deleteFile(currentPost.featuredImage);
                }
                dispatch(clearCurrentPost());
                navigate("/");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
                <Container>
                    <div className="flex justify-center items-center h-64">
                        <div className="relative w-16 h-16">
                            <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                            <div className="absolute top-1 left-1 w-14 h-14 rounded-full border-4 border-t-transparent border-r-blue-400 border-b-transparent border-l-transparent animate-spin"></div>
                        </div>
                    </div>
                </Container>
            </div>
        );
    }

    // No post state
    if (!currentPost) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16">
                <Container>
                    <div className="max-w-md mx-auto text-center bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                        <div className="mb-6 text-gray-300">
                            <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">Post Not Found</h2>
                        <p className="text-gray-600 mb-8">This post may have been removed or doesn't exist.</p>
                        <Link to="/" className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                            Return Home
                        </Link>
                    </div>
                </Container>
            </div>
        );
    }

    // Render post
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
            <Container>
                {/* Back Navigation */}
                <div className="max-w-4xl mx-auto mb-6">
                    <Link 
                        to="/" 
                        className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors group"
                    >
                        <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                        </svg>
                        Back to articles
                    </Link>
                </div>
                
                {/* Post Content */}
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                    {/* Featured Image */}
                    <div className="relative">
                        {currentPost.featuredImage ? (
                            <div className="w-full">
                                {imageError ? (
                                    <div className="w-full h-64 bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                                        <p className="text-gray-500">Image could not be loaded</p>
                                    </div>
                                ) : imageLoading ? (
                                    <div className="w-full h-64 bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                                        <div className="animate-pulse w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500"></div>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <img
                                            src={imageUrl}
                                            alt={currentPost.title}
                                            className="w-full h-96 object-cover"
                                            onError={() => setImageError(true)}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="w-full h-64 bg-gradient-to-r from-blue-50 to-indigo-100 flex items-center justify-center">
                                <svg className="w-16 h-16 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                        )}

                        {/* Status and Edit/Delete Controls */}
                        <div className="absolute top-4 left-4">
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                                currentPost.status === "active" 
                                    ? "bg-green-100 text-green-800" 
                                    : "bg-yellow-100 text-yellow-800"
                            }`}>
                                <span className={`w-2 h-2 mr-2 rounded-full ${
                                    currentPost.status === "active" 
                                        ? "bg-green-500" 
                                        : "bg-yellow-500"
                                }`}></span>
                                {currentPost.status === "active" ? "Published" : "Draft"}
                            </span>
                        </div>

                        {isAuthor && (
                            <div className="absolute right-4 top-4 flex space-x-2">
                                <Link to={`/edit-post/${currentPost.$id}`}>
                                    <Button bgColor="bg-green-500 hover:bg-green-600" className="flex items-center px-4 py-2 rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-1">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                        </svg>
                                        Edit
                                    </Button>
                                </Link>
                                <Button 
                                    bgColor="bg-red-500 hover:bg-red-600" 
                                    onClick={deletePost}
                                    className="flex items-center px-4 py-2 rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                    Delete
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Post Content */}
                    <div className="p-8 md:p-10">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight">{currentPost.title}</h1>
                        
                        {/* Author & Metadata */}
                        <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-gray-600">
                            <div className="inline-flex items-center">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                                    {currentPost.author?.charAt(0) || "A"}
                                </div>
                                <span className="ml-2 font-medium">{currentPost.author || "Anonymous"}</span>
                            </div>
                            
                            <div className="inline-flex items-center text-gray-500">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>{new Date(currentPost.$createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</span>
                            </div>
                            
                            {/* Estimate reading time - approximately 200 words per minute */}
                            <div className="inline-flex items-center text-gray-500">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                </svg>
                                <span>{Math.max(1, Math.ceil(currentPost.content.split(/\s+/).length / 200))} min read</span>
                            </div>
                        </div>
                        
                        {/* Main Content */}
                        <div className="prose prose-lg max-w-none">
                            <div className="mb-8 leading-relaxed">
                                {parse(currentPost.content)}
                            </div>
                        </div>
                        
                        {/* Tags & Share */}
                        <div className="mt-10 pt-8 border-t border-gray-100">
                            <div className="flex flex-wrap justify-between items-center">
                                <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
                                    {currentPost.tags?.map(tag => (
                                        <span key={tag} className="inline-block bg-gray-100 text-gray-800 rounded-full px-3 py-1 text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer">
                                            #{tag}
                                        </span>
                                    )) || (
                                        <span className="inline-block bg-blue-50 text-blue-600 rounded-full px-3 py-1 text-sm font-medium">
                                            #article
                                        </span>
                                    )}
                                </div>
                                
                                <div className="flex space-x-3">
                                    <button className="text-gray-500 hover:text-blue-600 transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                                        </svg>
                                    </button>
                                    <button className="text-gray-500 hover:text-red-600 transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                        </svg>
                                    </button>
                                    <button className="text-gray-500 hover:text-yellow-500 transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Author Bio Card */}
                <div className="max-w-4xl mx-auto mt-10 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-md border border-blue-100">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                            {currentPost.author?.charAt(0) || "A"}
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{currentPost.author || "Anonymous"}</h3>
                            <p className="text-gray-600 mb-4">Writer & Content Creator</p>
                            <p className="text-gray-700">
                                Thanks for reading! If you enjoyed this article, consider following for more content on similar topics.
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* Related Posts Teaser */}
                <div className="max-w-4xl mx-auto mt-12 mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">You might also like</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow group">
                            <div className="h-48 bg-gray-200 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 group-hover:opacity-75 transition-opacity"></div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">Related article title here</h3>
                                <p className="text-gray-600 mb-4 line-clamp-2">A preview of another interesting article that readers might enjoy.</p>
                                <Link to="/" className="text-blue-600 font-medium flex items-center">
                                    Read more
                                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </Link>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow group">
                            <div className="h-48 bg-gray-200 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 group-hover:opacity-75 transition-opacity"></div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">Another related article</h3>
                                <p className="text-gray-600 mb-4 line-clamp-2">A preview of another interesting article that readers might enjoy.</p>
                                <Link to="/" className="text-blue-600 font-medium flex items-center">
                                    Read more
                                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Comments Section */}
                <div className="max-w-4xl mx-auto mt-10 mb-20">
                    <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
                        {/* Use the Comments component here with the current post's ID */}
                        <Comments postId={currentPost.$id} />
                    </div>
                </div>
            </Container>
        </div>
    );
}