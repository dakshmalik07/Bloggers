import React, { useEffect, useState } from 'react'
import databaseService from '../appwrite/conf'
import { Container, PostCard } from '../components'
import { useDispatch, useSelector } from 'react-redux'
import { setPosts } from '../store/postSlice'
import BlogIdeaGenerator from '../components/BlogIdeaGenerator'

function Home() {
    const dispatch = useDispatch()
    const posts = useSelector((state) => state.posts.posts)
    const [loading, setLoading] = useState(false)
    const [featuredPosts, setFeaturedPosts] = useState([])
    const [regularPosts, setRegularPosts] = useState([])

    useEffect(() => {
        // Only fetch posts if we don't already have them
        if (posts.length === 0) {
            setLoading(true)
            databaseService.getPosts().then((response) => {
                if (response) {
                    dispatch(setPosts(response.documents))
                }
                setLoading(false)
            }).catch(() => {
                setLoading(false)
            })
        }
    }, [dispatch, posts.length]) // Changed dependency to posts.length

    // Separate useEffect to handle splitting posts whenever posts array changes
    useEffect(() => {
        if (posts.length > 0) {
            // Sort posts by creation date (newest first) to ensure new posts appear at the top
            const sortedPosts = [...posts].sort((a, b) => {
                // Assuming posts have a $createdAt or createdAt field
                const dateA = new Date(a.$createdAt || a.createdAt || 0)
                const dateB = new Date(b.$createdAt || b.createdAt || 0)
                return dateB - dateA
            })
            
            // Split posts into featured (first 3) and regular
            setFeaturedPosts(sortedPosts.slice(0, 3))
            setRegularPosts(sortedPosts.slice(3))
        } else {
            setFeaturedPosts([])
            setRegularPosts([])
        }
    }, [posts]) // This will run whenever posts array changes

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
                </div>

                <Container>
                    <div className="py-12">
                        {/* Loading Header */}
                        <div className="max-w-6xl mx-auto mb-12">
                            <div className="flex justify-between items-center mb-8">
                                <div className="animate-pulse">
                                    <div className="h-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl w-80 mb-4"></div>
                                    <div className="h-6 bg-slate-700/50 rounded-xl w-64"></div>
                                </div>
                            </div>
                            
                            {/* Loading Featured Post */}
                            <div className="relative group mb-12">
                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl animate-pulse"></div>
                                <div className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
                                    <div className="animate-pulse">
                                        <div className="h-96 bg-slate-700/50 rounded-2xl mb-6"></div>
                                        <div className="h-8 bg-slate-600/50 rounded-xl w-1/3 mb-4"></div>
                                        <div className="h-4 bg-slate-700/50 rounded-lg w-1/2"></div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Loading Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="group relative">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                                        <div className="relative bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl">
                                            <div className="animate-pulse">
                                                <div className="h-48 bg-slate-700/50"></div>
                                                <div className="p-6">
                                                    <div className="h-6 bg-slate-600/50 rounded-lg mb-4"></div>
                                                    <div className="h-4 bg-slate-700/50 rounded-lg w-1/2"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    if (posts.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden flex items-center justify-center">
                {/* Animated Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
                </div>

                <Container>
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                            <div className="relative bg-slate-900/50 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-12 shadow-2xl">
                                {/* Icon */}
                                <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-r from-purple-500 to-pink-500 text-white mb-8 shadow-2xl">
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                    </svg>
                                </div>
                                
                                <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent mb-6">
                                    Welcome to Our Blog
                                </h1>
                                <p className="text-slate-300 mb-10 text-xl leading-relaxed">
                                    Sign in to access exclusive content and join our community of readers and writers.
                                </p>
                                
                                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                    <a href="/login" className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold hover:shadow-2xl hover:shadow-purple-500/25 transform transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95">
                                        <span className="relative z-10 flex items-center justify-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                                            </svg>
                                            Sign In
                                        </span>
                                    </a>
                                    <a href="/signup" className="group relative px-8 py-4 bg-slate-800/50 border border-slate-600/50 text-slate-200 rounded-2xl font-semibold hover:bg-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95">
                                        <span className="relative z-10 flex items-center justify-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                                            </svg>
                                            Create Account
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
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

            {/* Hero Section */}
            <div className="relative py-30">
                <Container>
                    <div className="max-w-6xl mx-auto text-center">
                        <div className="mb-8">
                            <h1 className="text-7xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent mb-8 leading-tight">
                                Explore Ideas That Matter
                            </h1>
                            <p className="text-2xl text-slate-300 mb-12 leading-relaxed max-w-4xl mx-auto">
                                Discover thoughtful articles, stories, and insights from our community of writers.
                            </p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
                            <a href="/add-post" className="group relative px-10 py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/25 transform transition-all duration-300 hover:-translate-y-2 hover:scale-105 active:scale-95">
                                <span className="relative z-10 flex items-center justify-center">
                                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                                    </svg>
                                    Start Writing
                                </span>
                            </a>
                            <a href="/blog-ideas" className="group relative px-10 py-5 bg-slate-800/30 backdrop-blur-xl border border-slate-600/50 text-slate-200 rounded-2xl font-semibold text-lg hover:bg-slate-700/30 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-2 hover:scale-105 active:scale-95">
                                <span className="relative z-10 flex items-center justify-center">
                                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                                    </svg>
                                    Browse Topics
                                </span>
                            </a>
                        </div>
                    </div>
                </Container>
            </div>

            {/* Featured Posts Section */}
            {featuredPosts.length > 0 && (
                <div className="py-16">
                    <Container>
                        <div className="max-w-7xl mx-auto">
                            {/* Section Header */}
                            <div className="flex justify-between items-center mb-16">
                                <div>
                                    <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-4">
                                        Featured Articles
                                    </h2>
                                    <p className="text-slate-400 text-lg">Handpicked stories that inspire and inform</p>
                                </div>
                                <a href="/all-posts" className="group flex items-center px-6 py-3 bg-slate-800/30 backdrop-blur-xl border border-slate-600/50 text-slate-300 rounded-2xl font-medium hover:bg-slate-700/30 hover:border-purple-500/50 hover:text-white transition-all duration-300 hover:scale-105">
                                    View all articles
                                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </a>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {featuredPosts.map((post, index) => (
                                    <div key={post.$id} className="group relative">
                                        <div className={`absolute -inset-0.5 bg-gradient-to-r ${
                                            index === 0 ? 'from-purple-500 to-pink-500' :
                                            index === 1 ? 'from-blue-500 to-cyan-500' :
                                            'from-green-500 to-emerald-500'
                                        } rounded-3xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
                                        <div className="relative bg-slate-900/40 backdrop-blur-2xl border border-slate-700/50 rounded-3xl  shadow-2xl transform transition-all duration-500 hover:-translate-y-4 hover:scale-105">
                                            <PostCard {...post} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Container>
                </div>
            )}

            {/* Recent Posts Section */}
            {regularPosts.length > 0 && (
                <div className="py-20">
                    <Container>
                        <div className="max-w-7xl mx-auto">
                            {/* Section Header */}
                            <div className="flex justify-between items-center mb-16">
                                <div>
                                    <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-4">
                                        Recent Articles
                                    </h2>
                                    <p className="text-slate-400 text-lg">Fresh perspectives and latest insights</p>
                                </div>
                                <div className="flex space-x-4">
                                    <button className="group p-4 bg-slate-800/30 backdrop-blur-xl border border-slate-600/50 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-700/30 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                                        </svg>
                                    </button>
                                    <button className="group p-4 bg-slate-800/30 backdrop-blur-xl border border-slate-600/50 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-700/30 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {regularPosts.map((post) => (
                                    <div key={post.$id} className="group relative">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-600 to-slate-700 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                                        <div className="relative bg-slate-800/20 backdrop-blur-xl border border-slate-700/30 rounded-2xl  shadow-xl transform transition-all duration-300 hover:-translate-y-2 hover:scale-105">
                                            <PostCard {...post} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Container>
                </div>
            )}

            {/* Newsletter Section */}
            <div className="py-24">
                <Container>
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                            <div className="relative bg-slate-900/40 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-12 shadow-2xl">
                                {/* Icon */}
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white mb-8 shadow-2xl">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                    </svg>
                                </div>
                                
                                <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-6">
                                    Stay Updated
                                </h2>
                                <p className="text-slate-300 mb-10 text-xl leading-relaxed">
                                    Get the latest articles and news delivered to your inbox weekly.
                                </p>
                                
                                <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-2xl mx-auto">
                                    <input 
                                        type="email" 
                                        placeholder="Enter your email address" 
                                        className="flex-1 px-8 py-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-xl transition-all duration-300" 
                                    />
                                    <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-semibold hover:shadow-2xl hover:shadow-blue-500/25 transform transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95 whitespace-nowrap">
                                        Subscribe Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        </div>
    )
}

export default Home