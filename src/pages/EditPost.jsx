import React, { useEffect, useState } from 'react'
import { Container, PostForm } from '../components'
import databaseService from '../appwrite/conf'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setCurrentPost } from '../store/postSlice'

function EditPost() {
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const { slug } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // Try to get post from global state first
    const storePost = useSelector((state) => {
        return state.posts.posts.find(p => p.$id === slug) || state.posts.currentPost
    })

    useEffect(() => {
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
            <div className="py-16 bg-gray-50 min-h-screen">
                <Container>
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                </Container>
            </div>
        )
    }

    return post ? (
        <div className="py-10 bg-gray-50 min-h-screen">
            <Container>
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
                        <div className="px-6 py-4 bg-blue-600 text-white">
                            <h2 className="text-xl font-bold">Edit Post</h2>
                            <p className="text-blue-100 text-sm">Update your post content and details</p>
                        </div>
                        <div className="p-6">
                            <PostForm post={post} />
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    ) : null
}

export default EditPost