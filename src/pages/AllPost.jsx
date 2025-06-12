import React, { useEffect, useState, useRef } from 'react'
import { Container, PostCard } from '../components'
import databaseService from '../appwrite/conf'
import { useDispatch, useSelector } from 'react-redux'
import { setPosts, addPost } from '../store/postSlice'

function AllPosts() {
    const [loading, setLoading] = useState(false) // Changed from true to false
    const [viewMode, setViewMode] = useState('grid')
    const [searchTerm, setSearchTerm] = useState('')
    const [sortBy, setSortBy] = useState('newest')
    const [refreshing, setRefreshing] = useState(false)
    const dispatch = useDispatch()
    const posts = useSelector((state) => state.posts.posts)
    const heroRef = useRef(null)

    // Fetch posts function
    const fetchPosts = async (forceRefresh = false) => {
        try {
            if (forceRefresh) setRefreshing(true)
            else setLoading(true)
            
            const response = await databaseService.getPosts([])
            if (response) {
                console.log("Fetched posts:", response.documents.length)
                dispatch(setPosts(response.documents))
            }
        } catch (error) {
            console.error("Error fetching posts:", error)
        } finally {
            setTimeout(() => {
                setLoading(false)
                setRefreshing(false)
            }, 300) // Reduced delay from 500ms to 300ms
        }
    }

    // Only fetch if posts are not already loaded
    useEffect(() => {
        if (posts.length === 0) {
            fetchPosts()
        }
    }, []) // Removed dispatch dependency to prevent unnecessary re-runs

   
    // Filter and sort posts
    const filteredPosts = posts
        .filter(post => 
            post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.$createdAt) - new Date(a.$createdAt)
                case 'oldest':
                    return new Date(a.$createdAt) - new Date(b.$createdAt)
                case 'title':
                    return a.title?.localeCompare(b.title) || 0
                default:
                    return 0
            }
        })

    const LoadingSpinner = () => (
        <div className="flex justify-center items-center py-20">
            <div className="relative">
                <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-200/30"></div>
                <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-500 border-t-transparent absolute top-0 left-0"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce"></div>
                </div>
            </div>
        </div>
    )

    const EmptyState = () => (
        <div className="col-span-full py-32 text-center relative">
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                <div className="relative bg-slate-900/50 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-12 shadow-2xl">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-r from-purple-500 to-pink-500 text-white mb-8 shadow-2xl">
                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    <h3 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent mb-6">
                        No posts found
                    </h3>
                    <p className="text-slate-300 mb-10 text-xl max-w-md mx-auto leading-relaxed">
                        {searchTerm ? `No posts match "${searchTerm}"` : "Start your journey by creating your first masterpiece"}
                    </p>
                    <button 
                        onClick={() => window.location.href = '/add-post'}
                        className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold hover:shadow-2xl hover:shadow-purple-500/25 transform transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95"
                    >
                        <span className="relative z-10 flex items-center justify-center">
                            <svg className="w-6 h-6 mr-3 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Create Your First Post
                        </span>
                    </button>
                </div>
            </div>
        </div>
    )

    // Show immediate content if posts are available, with optional loading overlay for refresh
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

            {/* Enhanced Hero Section */}
            <div className="relative py-24 text-center z-10">
                <Container>
                    <div className="relative z-10">
                        <div className="mb-12">
                        <h1 className="text-8xl md:text-9xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-6 leading-none">
                                Discover
                            </h1>
                            <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-8"></div>
                            <p className="text-xl text-slate-300 mb-12 leading-relaxed max-w-3xl mx-auto">
                                Explore our complete collection of <span className="text-purple-300 font-medium">extraordinary stories</span> and <span className="text-pink-300 font-medium">brilliant insights</span>
                            </p>
                        </div>
                        
                        {/* Enhanced Search and Filter Bar */}
                        <div className="max-w-5xl mx-auto mb-10">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative bg-slate-900/50 backdrop-blur-2xl border border-slate-700/50 rounded-2xl p-4 shadow-2xl">
                                    <div className="flex flex-col lg:flex-row gap-6 items-center">
                                        {/* Search Input */}
                                        <div className="relative flex-1 w-full">
                                            <div className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-slate-400">
                                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Search for amazing content..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full pl-16 pr-6 py-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 text-lg placeholder-slate-400 text-white backdrop-blur-xl"
                                            />
                                        </div>

                                        {/* Sort Dropdown */}
                                        <div className="relative ">
                                            <select
                                                value={sortBy}
                                                onChange={(e) => setSortBy(e.target.value)}
                                                className="px-6 py-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 appearance-none cursor-pointer min-w-[180px] text-lg font-medium text-white backdrop-blur-xl"
                                            >
                                                <option value="newest">✨ Newest First</option>
                                                <option value="oldest">⏰ Oldest First</option>
                                                <option value="title">📝 By Title</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                                </svg>
                                            </div>
                                        </div>

                                        {/* View Mode Toggle */}
                                        <div className="flex bg-slate-800/30 backdrop-blur-xl border border-slate-600/50 rounded-2xl p-2">
                                            <button
                                                onClick={() => setViewMode('grid')}
                                                className={`p-3 rounded-xl transition-all duration-300 ${
                                                    viewMode === 'grid' 
                                                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105' 
                                                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                                                }`}
                                            >
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => setViewMode('list')}
                                                className={`p-3 rounded-xl transition-all duration-300 ${
                                                    viewMode === 'list' 
                                                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105' 
                                                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                                                }`}
                                            >
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Refresh Button */}
                                        <button
                                            onClick={() => fetchPosts(true)}
                                            disabled={refreshing}
                                            className="group p-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 hover:scale-105 active:scale-95"
                                        >
                                            <svg className={`w-6 h-6 ${refreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Bar */}
                        <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                                <div className="relative flex items-center bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl px-6 py-3 shadow-lg">
                                    <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mr-3 animate-pulse"></div>
                                    <span className="font-semibold text-slate-300">{filteredPosts.length} posts discovered</span>
                                </div>
                            </div>
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                                <div className="relative flex items-center bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl px-6 py-3 shadow-lg">
                                    <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mr-3 animate-pulse"></div>
                                    <span className="font-semibold text-slate-300">Fresh content</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            {/* Enhanced Main Content */}
            <Container>
                <div className="relative z-10 pb-32 pt-8">
                    {/* Show loading only for initial load when no posts exist */}
                    {loading && posts.length === 0 ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            {/* Optional refresh indicator overlay */}
                            {refreshing && (
                                <div className="fixed top-8 right-8 z-50">
                                    <div className="relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-75"></div>
                                        <div className="relative bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 text-white px-6 py-3 rounded-2xl shadow-2xl">
                                            <div className="flex items-center">
                                                <svg className="animate-spin w-5 h-5 mr-3 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                                <span className="font-medium">Refreshing posts...</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <div className={`
                                ${viewMode === 'grid' 
                                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8' 
                                    : 'space-y-8 max-w-4xl mx-auto'
                                }
                            `}>
                                {filteredPosts.length === 0 ? (
                                    <EmptyState />
                                ) : (
                                    filteredPosts.map((post, index) => (
                                        <div
                                            key={post.$id}
                                            className={`
                                                group transform transition-all duration-500 hover:scale-105
                                                ${viewMode === 'list' ? 'w-full' : 'h-full'}
                                            `}
                                        >
                                            <div className="relative group">
                                                <div className={`absolute -inset-0.5 bg-gradient-to-r ${
                                                    index % 4 === 0 ? 'from-purple-500 to-pink-500' :
                                                    index % 4 === 1 ? 'from-blue-500 to-cyan-500' :
                                                    index % 4 === 2 ? 'from-green-500 to-emerald-500' :
                                                    'from-orange-500 to-red-500'
                                                } rounded-3xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
                                                <div className={`
                                                    ${viewMode === 'grid' ? 'h-full' : 'h-auto'} 
                                                    relative bg-slate-900/40 backdrop-blur-2xl border border-slate-700/50 rounded-3xl shadow-2xl
                                                    transform transition-all duration-500 hover:-translate-y-4 hover:scale-105
                                                    flex flex-col
                                                `}>
                                                    <PostCard {...post} viewMode={viewMode} />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}
                </div>
            </Container>

            {/* Enhanced Floating Action Button */}
            <div className="fixed bottom-8 right-8 z-50">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                    <button 
                        onClick={() => window.location.href = '/add-post'}
                        className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white p-5 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 hover:from-purple-700 hover:to-pink-700 backdrop-blur-xl"
                    >
                        <svg className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <div className="absolute -top-16 right-0 bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 text-white text-sm px-4 py-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-2xl">
                            Create New Post
                            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900/90"></div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AllPosts