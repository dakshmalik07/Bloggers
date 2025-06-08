import React, { useEffect, useState } from 'react'
import { Container, PostCard } from '../components'
import databaseService from '../appwrite/conf'
import { useDispatch, useSelector } from 'react-redux'
import { setPosts } from '../store/postSlice'

function AllPosts() {
    const [loading, setLoading] = useState(true)
    const dispatch = useDispatch()
    const posts = useSelector((state) => state.posts.posts)

    useEffect(() => {
        // Only fetch posts if we don't already have them
        if (posts.length === 0) {
            setLoading(true)
            databaseService.getPosts([])
                .then((response) => {
                    if (response) {
                        console.log("Fetched posts:", response.documents.length)
                        dispatch(setPosts(response.documents))
                    }
                })
                .catch(error => {
                    console.error("Error fetching posts:", error)
                })
                .finally(() => {
                    setLoading(false)
                })
        } else {
            setLoading(false)
        }
    }, [dispatch, posts.length])

    return (
        <div className="w-full py-12 bg-gradient-to-b from-gray-100 to-white min-h-screen">
            <Container>
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">All Posts</h1>
                    <p className="text-gray-600">Discover all the latest articles and content</p>
                </div>
                
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
                        {posts.length === 0 ? (
                            <div className="col-span-full py-16 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                </svg>
                                <h3 className="mt-2 text-lg font-medium text-gray-900">No posts found</h3>
                                <p className="mt-1 text-sm text-gray-500">Get started by creating a new post.</p>
                            </div>
                        ) : (
                            posts.map((post) => (
                                <PostCard key={post.$id} {...post} />
                            ))
                        )}
                    </div>
                )}
            </Container>
        </div>
    )
}

export default AllPosts