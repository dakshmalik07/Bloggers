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
        } else {
            // Split posts into featured (first 3) and regular
            setFeaturedPosts(posts.slice(0, 3))
            setRegularPosts(posts.slice(3))
        }
    }, [dispatch, posts])

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
                <Container>
                    <div className="max-w-6xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-4xl font-bold text-gray-800">Discover Stories</h1>
                        </div>
                        <div className="animate-pulse mb-12">
                            <div className="h-96 bg-gray-200 rounded-2xl mb-4"></div>
                            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                            <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                                    <div className="h-48 bg-gray-200"></div>
                                    <div className="p-5">
                                        <div className="h-6 bg-gray-200 rounded mb-4"></div>
                                        <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    if (posts.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center py-12">
                <Container>
                    <div className="max-w-md mx-auto text-center bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 text-blue-600 mb-6">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">
                            Welcome to Our Blog
                        </h1>
                        <p className="text-gray-600 mb-8 text-lg">
                            Sign in to access exclusive content and join our community of readers.
                        </p>
                        <div className="flex space-x-4 justify-center">
                            <a href="/login" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md">
                                Sign In
                            </a>
                            <a href="/signup" className="px-6 py-3 bg-white text-blue-600 border border-blue-200 rounded-lg font-medium hover:bg-blue-50 transition-colors shadow-sm">
                                Create Account
                            </a>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
                <Container>
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl font-bold mb-6">Explore Ideas That Matter</h1>
                        <p className="text-xl opacity-90 mb-8">Discover thoughtful articles, stories, and insights from our community of writers.</p>
                        <div className="inline-flex space-x-4">
                            <a href="/add-post" className="px-6 py-3 bg-white text-blue-700 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-md">
                                Start Writing
                            </a>
                            <a href="/blog-ideas" className="px-6 py-3 bg-blue-500 bg-opacity-30 text-white rounded-lg font-medium hover:bg-opacity-40 transition-colors border border-white border-opacity-20">
                                Browse Topics
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
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="text-3xl font-bold text-gray-800">Featured Articles</h2>
                                <a href="/all-posts" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                                    View all articles
                                    <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </a>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {featuredPosts.map((post) => (
                                    <div key={post.$id} className="transform transition duration-300 hover:-translate-y-2">
                                        <div className="bg-white rounded-xl shadow-md overflow-hidden h-full">
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
                <div className="py-12 bg-gray-50">
                    <Container>
                        <div className="max-w-7xl mx-auto">
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="text-3xl font-bold text-gray-800">Recent Articles</h2>
                                <div className="flex space-x-2">
                                    <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                                        </svg>
                                    </button>
                                    <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {regularPosts.map((post) => (
                                    <div key={post.$id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                                        <PostCard {...post} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Container>
                </div>
            )}

            {/* Newsletter Section */}
            <div className="py-16 bg-white">
                <Container>
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-6">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Stay Updated</h2>
                        <p className="text-gray-600 mb-8 text-lg">Get the latest articles and news delivered to your inbox weekly.</p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <input 
                                type="email" 
                                placeholder="Enter your email address" 
                                className="px-6 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:min-w-[300px]" 
                            />
                            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md">
                                Subscribe
                            </button>
                        </div>
                    </div>
                    <div>
                    
                    </div>
                </Container>
            </div>
        </div>
    )
}

export default Home