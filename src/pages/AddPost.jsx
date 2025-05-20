import React from 'react'
import { PostForm, Container } from '../components'

function AddPost() {
  return (
    <div className="py-12 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <Container>
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">Create New Article</h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Share your ideas, stories, and insights with our community. Craft your post with care and inspire others.
            </p>
          </div>
          
          {/* Card Container */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            {/* Form */}
            <PostForm />
          </div>
          
          {/* Writing Tips */}
          <div className="mt-10 bg-blue-50 rounded-xl p-6 border border-blue-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
              Writing Tips
            </h3>
            <ul className="text-gray-700 space-y-2">
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                Use a clear, attention-grabbing headline to capture readers' interest
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                Include a high-quality featured image related to your content
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                Structure your content with headings to improve readability
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default AddPost