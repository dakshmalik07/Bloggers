import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import databaseService from '../appwrite/conf'

function PostCard({ $id, title, featuredImage, slug }) {
    const [imageUrl, setImageUrl] = useState(null)
    const [imageError, setImageError] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (featuredImage) {
            // Load image URL only once when component mounts
            const loadImage = async () => {
                setLoading(true)
                try {
                    const url = await databaseService.getFilePreview(featuredImage)
                    setImageUrl(url)
                } catch (error) {
                    console.error("Error loading image:", error)
                    setImageError(true)
                } finally {
                    setLoading(false)
                }
            }
            
            loadImage()
        } else {
            setLoading(false)
        }
    }, [featuredImage])

    return (
        <Link to={`/post/${$id}`} className="block transition-transform duration-300 hover:translate-y-[-4px] h-full">
            <div className='w-full h-full bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300 flex flex-col'>
                <div className='relative w-full h-60 flex-shrink-0'>
                    {loading ? (
                        <div className='w-full h-full bg-gray-100 animate-pulse flex items-center justify-center'>
                            <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                        </div>
                    ) : featuredImage ? (
                        imageError ? (
                            <div className='w-full h-full bg-gray-50 flex items-center justify-center'>
                                <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                        ) : (
                            <img 
                                src={imageUrl} 
                                alt={title}
                                className='object-cover w-full h-full transition-transform duration-300 hover:scale-105'
                                onError={() => setImageError(true)}
                            />
                        )
                    ) : (
                        <div className='w-full h-full bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center'>
                            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                    )}
                </div>
                <div className="p-5 flex-grow flex flex-col">
                    <h2 className='text-lg font-semibold text-gray-800 line-clamp-2 mb-1 min-h-[3.5rem] flex-grow'>{title}</h2>
                    <div className="flex items-center mt-2">
                        <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">
                            Article
                        </div>
                        <div className="ml-auto text-xs text-gray-500">
                            View details →
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default PostCard