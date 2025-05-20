import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setComments, addComment, deleteComment, setCommentsLoading, setCommentsError } from '../store/commentsSlice';
import Button from './Button';
import databaseService from '../appwrite/conf';


const Comments = ({ postId }) => {
    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const dispatch = useDispatch();
    const { comments, isLoading, error } = useSelector((state) => state.comments);
    const userData = useSelector((state) => state.auth.userData);
    const isLoggedIn = useSelector((state) => state.auth.status);

    // Fetch comments when component mounts
    useEffect(() => {
        const fetchComments = async () => {
            if (!postId) return;
            
            dispatch(setCommentsLoading());
            try {
                const response = await databaseService.getComments(postId);
                dispatch(setComments(response.documents));
            } catch (error) {
                console.error('Error fetching comments:', error);
                dispatch(setCommentsError('Failed to load comments'));
            }
        };

        fetchComments();
    }, [postId, dispatch]);

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        
        if (!commentText.trim() || !isLoggedIn || isSubmitting) return;
        
        setIsSubmitting(true);
        
        try {
            const newComment = await databaseService.createComment({
                postId,
                userId: userData.$id,
                userName: userData.name,
                content: commentText.trim()
            });
            
            dispatch(addComment(newComment));
            setCommentText('');
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Failed to add comment. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!isLoggedIn) return;
        
        if (window.confirm('Are you sure you want to delete this comment?')) {
            try {
                await databaseService.deleteComment(commentId);
                dispatch(deleteComment(commentId));
            } catch (error) {
                console.error('Error deleting comment:', error);
                alert('Failed to delete comment. Please try again.');
            }
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="comments-section">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Join the conversation</h3>
            
            {/* Comment Form */}
            <div className="flex space-x-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                    {userData ? userData.name.charAt(0).toUpperCase() : 'G'}
                </div>
                <div className="flex-1">
                    <form onSubmit={handleSubmitComment}>
                        <textarea 
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                            placeholder={isLoggedIn ? "Add your thoughts..." : "Please log in to comment"}
                            rows="3"
                            disabled={!isLoggedIn || isSubmitting}
                        ></textarea>
                        <div className="mt-2 flex justify-end">
                            <Button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300"
                                disabled={!isLoggedIn || isSubmitting || !commentText.trim()}
                            >
                                {isSubmitting ? 'Posting...' : 'Comment'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
            
            {/* Comments List */}
            <div className="comments-list space-y-6">
                {isLoading ? (
                    <div className="flex justify-center py-6">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-4 text-red-500">{error}</div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">Be the first to comment on this post!</div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.$id} className="comment bg-gray-50 rounded-lg p-4 border border-gray-100">
                            <div className="flex items-start space-x-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                                    {comment.userName.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-semibold text-gray-800">{comment.userName}</h4>
                                      
                                    </div>
                                    <p className="text-gray-700">{comment.content}</p>
                                    
                                    {/* Only show delete button for the comment owner */}
                                    {userData && userData.$id === comment.userId && (
                                        <div className="mt-2 flex justify-end">
                                            <button 
                                                onClick={() => handleDeleteComment(comment.$id)}
                                                className="text-xs text-red-500 hover:text-red-700"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Comments;