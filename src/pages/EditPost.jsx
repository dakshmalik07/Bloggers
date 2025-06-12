import React, { useEffect, useState } from 'react'
import { Container, PostForm } from '../components'
import databaseService from '../appwrite/conf'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setCurrentPost } from '../store/postSlice'

function EditPost() {
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const [pageVisible, setPageVisible] = useState(false)
    const { slug } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // Try to get post from global state first
    const storePost = useSelector((state) => {
        return state.posts.posts.find(p => p.$id === slug) || state.posts.currentPost
    })

    useEffect(() => {
        // Trigger page animation
        setTimeout(() => setPageVisible(true), 100)
        
        if (slug) {
            // If we already have the post in the component state, don't fetch again
            if (post) {
                setLoading(false)
                return
            }
            
            // If we have the post in redux state
            if (storePost && storePost.$id === slug) {
                setPost(storePost)
                dispatch(setCurrentPost(storePost))
                setLoading(false)
                return
            }
            
            // Fetch the post if not available
            databaseService.getPost(slug)
                .then((postData) => {
                    if (postData) {
                        console.log("Fetched post for editing:", postData)
                        setPost(postData)
                        dispatch(setCurrentPost(postData))
                    } else {
                        console.log("No post found with ID:", slug)
                        navigate('/')
                    }
                })
                .catch((error) => {
                    console.error("Error fetching post:", error)
                    navigate('/')
                })
                .finally(() => setLoading(false))
        } else {
            navigate('/')
        }
    }, [slug, navigate, dispatch, storePost])

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
                </div>
                
                <Container>
                    <div className="flex flex-col items-center justify-center space-y-8">
                        {/* Loading Spinner */}
                        <div className="relative">
                            <div className="w-20 h-20 border-4 border-purple-500/20 rounded-full animate-spin">
                                <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
                            </div>
                            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-pink-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                        </div>
                        
                        {/* Loading Text */}
                        <div className="text-center space-y-3">
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                                Loading Your Post
                            </h2>
                            <p className="text-slate-400 animate-pulse">
                                Preparing the editor for you...
                            </p>
                        </div>
                        
                        {/* Loading Progress Dots */}
                        <div className="flex space-x-2">
                            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
                            <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce delay-100"></div>
                            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    return post ? (
        <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden transition-all duration-1000 ${pageVisible ? 'opacity-100' : 'opacity-0'}`}>
            {/* Animated Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
                
                {/* Floating Particles */}
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400/30 rounded-full animate-ping delay-300"></div>
                <div className="absolute top-3/4 left-3/4 w-1 h-1 bg-pink-400/40 rounded-full animate-ping delay-700"></div>
                <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-blue-400/30 rounded-full animate-ping delay-1000"></div>
            </div>

            <Container>
                <div className={`py-12 transition-all duration-1000 delay-300 ${pageVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    {/* Header Section */}
                    <div className="max-w-6xl mx-auto mb-12">
                        {/* Breadcrumb Navigation */}
                        <div className="flex items-center space-x-2 text-sm text-slate-400 mb-6">
                            <button 
                                onClick={() => navigate('/')}
                                className="hover:text-purple-400 transition-colors duration-200 flex items-center"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                                </svg>
                                Home
                            </button>
                            <span>/</span>
                            <button 
                                onClick={() => navigate(`/post/${post.$id}`)}
                                className="hover:text-purple-400 transition-colors duration-200"
                            >
                                {post.title}
                            </button>
                            <span>/</span>
                            <span className="text-purple-400">Edit</span>
                        </div>

                        {/* Hero Header */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                            <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-6">
                                        <div className="relative">
                                            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                </svg>
                                            </div>
                                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent mb-2">
                                                Edit Article
                                            </h1>
                                            <p className="text-slate-300 text-lg">
                                                Refine and update your content
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    <div className="flex items-center space-x-4">
                                        <button
                                            onClick={() => navigate(`/post/${post.$id}`)}
                                            className="flex items-center px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 rounded-xl text-slate-300 hover:text-white transition-all duration-300 hover:scale-105"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                            </svg>
                                            Preview
                                        </button>
                                        
                                        <div className="flex items-center space-x-2 text-green-400 text-sm bg-green-500/10 px-4 py-2 rounded-xl border border-green-500/20">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                            <span>Editing Mode</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Post Metadata */}
                                <div className="mt-6 pt-6 border-t border-slate-700/50">
                                    <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                            </svg>
                                            Last updated: {new Date(post.$updatedAt).toLocaleDateString()}
                                        </div>
                                        
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                                            </svg>
                                            Status: <span className={`ml-1 px-2 py-1 rounded-full text-xs ${post.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                                {post.status}
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-2 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                                            </svg>
                                            Slug: <span className="ml-1 font-mono text-pink-400">/{post.$id}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Container */}
                    <div className="max-w-6xl mx-auto">
                        <PostForm post={post} />
                    </div>
                </div>
            </Container>
        </div>
    ) : null
}

export default EditPost