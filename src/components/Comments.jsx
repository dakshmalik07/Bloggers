// src/components/Comments.jsx - Clean version without excessive logging
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  setComments, 
  addComment, 
  deleteComment, 
  setCommentsLoading, 
  setCommentsError,
  clearComments 
} from '../store/commentsSlice';
import cacheManager from '../redis/cacheManager';

function Comments({ postId }) {
  const dispatch = useDispatch();
  const { comments, isLoading, error } = useSelector(state => state.comments);
  const userData = useSelector(state => state.auth.userData);
  
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadComments = useCallback(async (forceRefresh = false) => {
    if (!postId) return;
    
    dispatch(setCommentsLoading());
    
    try {
      console.log(`🔍 Loading comments for post ${postId}...`);
      const result = await cacheManager.getCommentsWithCache(postId, { forceRefresh });
      
      // Log whether data came from cache or database
      if (result.fromCache) {
        console.log(`✅ Comments loaded from REDIS cache for post ${postId}`);
        console.log(`📊 Cache timestamp: ${new Date(result.timestamp).toLocaleString()}`);
      } else {
        console.log(`📁 Comments loaded from DATABASE for post ${postId}`);
      }
      
      console.log(`💬 Loaded ${result.data?.length || 0} comments`);
      dispatch(setComments(result.data || []));
    } catch (error) {
      console.error(`❌ Error loading comments for post ${postId}:`, error);
      dispatch(setCommentsError(error.message));
    }
  }, [postId, dispatch]);

  useEffect(() => {
    if (postId) {
      loadComments();
    }
    
    return () => {
      if (postId) {
        dispatch(clearComments());  //it does not run right away,it runs when the component unmounts or before the next effect runs
      }
    };
  }, [postId, loadComments]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!userData) {
      alert('Please login to comment');
      return;
    }
    
    if (!newComment.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const commentData = {
        content: newComment.trim(),
        postId: postId,
        userId: userData.$id,
        userName: userData.name,
        userEmail: userData.email,
      };
      
      const createdComment = await cacheManager.addCommentWithCache(postId, commentData);
      dispatch(addComment(createdComment));
      setNewComment('');
      
    } catch (error) {
      alert('Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }
    
    try {
      await cacheManager.deleteCommentWithCache(postId, commentId);
      dispatch(deleteComment(commentId));
    } catch (error) {
      alert('Failed to delete comment. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Comments</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-50 p-4 rounded-lg animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-full mb-1"></div>
              <div className="h-3 bg-gray-300 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Comments</h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Failed to load comments: {error}</p>
          <button 
            onClick={() => loadComments()}
            className="text-red-700 hover:text-red-800 underline mt-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">
        Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      {userData ? (
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows="3"
            disabled={isSubmitting}
            maxLength={1000}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <p className="text-gray-600">Please login to join the conversation.</p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No comments yet</p>
            <p className="text-gray-400 text-sm">Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.$id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {comment.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{comment.userName}</h4>
                    <p className="text-sm text-gray-500">{formatDate(comment.$createdAt)}</p>
                  </div>
                </div>
                {userData && userData.$id === comment.userId && (
                  <button
                    onClick={() => handleDeleteComment(comment.$id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="text-gray-700 ml-11">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Comments;