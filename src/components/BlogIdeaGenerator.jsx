// src/components/FixedBlogIdeaGenerator.jsx
import React, { useState, useEffect } from 'react';
import { generateBlogIdeas } from '../utils/openai';

const BlogIdeaGenerator = () => {
  const [topic, setTopic] = useState('');
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(null);
  const [lastGeneratedTopic, setLastGeneratedTopic] = useState(null);
  const [showTopicsModal, setShowTopicsModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState('popular');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTopics, setFilteredTopics] = useState([]);
  
  const categories = [
    { id: 'popular', name: 'Popular' },
    { id: 'technology', name: 'Technology' },
    { id: 'lifestyle', name: 'Lifestyle' },
    { id: 'business', name: 'Business' },
    { id: 'health', name: 'Health & Wellness' },
    { id: 'creative', name: 'Creative' }
  ];
  
  const topicsByCategory = {
    popular: ['Digital Marketing', 'Remote Work', 'Personal Finance', 'AI & Machine Learning', 'Self Improvement'],
    technology: ['Web Development', 'Data Science', 'Cybersecurity', 'Mobile Apps', 'Tech Ethics', 'Smart Home', 'Coding'],
    lifestyle: ['Minimalism', 'Travel', 'Food & Cooking', 'Fashion', 'Interior Design', 'Parenting', 'Sustainability'],
    business: ['Startups', 'Entrepreneurship', 'Leadership', 'E-commerce', 'Career Development', 'Marketing', 'Productivity'],
    health: ['Fitness', 'Mental Health', 'Nutrition', 'Yoga', 'Meditation', 'Sleep', 'Chronic Illness'],
    creative: ['Photography', 'Writing', 'Graphic Design', 'Music', 'DIY Projects', 'Art', 'Crafts']
  };
  
  // Filter topics based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredTopics(topicsByCategory[activeCategory] || []);
      return;
    }
    
    const lowercaseSearch = searchTerm.toLowerCase();
    
    // Search across all categories
    const allTopics = Object.values(topicsByCategory).flat();
    const results = allTopics.filter(topic => 
      topic.toLowerCase().includes(lowercaseSearch)
    );
    
    setFilteredTopics(results);
  }, [searchTerm, activeCategory]);
  
  // Initialize filtered topics
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredTopics(topicsByCategory[activeCategory] || []);
    }
  }, [activeCategory]);
  
  const handleGenerate = async () => {
    if (!topic || loading) return;
    
    setLoading(true);
    setError(null);
    setIdeas([]);
    setLastGeneratedTopic(topic);
    
    try {
      // Mock generated ideas for demonstration purposes
      setTimeout(() => {
        const demoIdeas = [
          `The Ultimate Guide to ${topic} for Beginners`,
          `10 Innovative Ways to Approach ${topic} in 2025`,
          `How ${topic} is Changing the Future of Industry`,
          `The Science Behind ${topic}: What Research Reveals`,
          `${topic} Trends That Will Dominate Next Year`,
          `Common Mistakes to Avoid When Working With ${topic}`,
          `How to Build a Career in ${topic}`,
          `${topic} Case Studies: Success Stories and Lessons Learned`
        ];
        
        setIdeas(demoIdeas);
        setLoading(false);
      }, 1500);
      
    } catch (err) {
      console.error("Generator error:", err);
      setError("An unexpected error occurred. Please try again or use our suggested ideas.");
      setLoading(false);
    }
  };
  
  const handleCopyIdea = (idea) => {
    navigator.clipboard.writeText(idea);
    setCopied(idea);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleGenerate();
    }
  };
  
  const handleSelectTopic = (selectedTopic) => {
    setTopic(selectedTopic);
    setShowTopicsModal(false);
  };
  
  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setSearchTerm('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto relative p-8 bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl shadow-lg border border-indigo-100 my-8 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-300 rounded-full filter blur-3xl opacity-20 -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-300 rounded-full filter blur-3xl opacity-20 -ml-10 -mb-10"></div>
      
      <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 mb-8 relative">
        Spark Your Creativity
        <span className="block text-lg font-normal text-indigo-600 mt-1 opacity-80">Blog Idea Generator</span>
      </h2>
      
      <div className="flex flex-col sm:flex-row gap-4 relative z-10">
        <div className="flex-grow relative">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter a topic (e.g. fitness, tech, finance...)"
            className="w-full px-5 py-4 border-0 rounded-xl bg-white bg-opacity-80 backdrop-blur-sm shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all duration-200 placeholder-indigo-300"
          />
          <button 
            onClick={() => setShowTopicsModal(true)} 
            className="absolute right-4 top-4 text-indigo-500 hover:text-indigo-700 transition-colors"
            title="Browse Topics"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </button>
        </div>
        <button 
          onClick={handleGenerate} 
          disabled={loading || !topic.trim()}
          className={`px-8 py-4 ${!topic.trim() ? 'bg-gray-400' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'} text-white rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center justify-center min-w-[140px]`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <span className="mr-2">✨</span> Generate Ideas
            </>
          )}
        </button>
      </div>
      
      <div className="mt-5 flex gap-2 flex-wrap relative z-10">
        <button 
          onClick={() => setShowTopicsModal(true)}
          className="px-5 py-3 bg-white bg-opacity-70 backdrop-blur-sm text-indigo-700 rounded-xl font-medium hover:bg-opacity-100 transition-all duration-300 border border-indigo-100 flex items-center group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500 group-hover:text-indigo-700 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Browse Topics
        </button>
      </div>
      
      {error && (
        <div className="mt-6 p-4 bg-amber-50 border-l-4 border-amber-400 text-amber-700 rounded-r-lg shadow-sm">
          <p className="font-medium">Note:</p>
          <p>{error}</p>
        </div>
      )}
      
      {ideas.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-indigo-800 mb-5 flex items-center">
            <span className="mr-2">💡</span>
            {error ? `Suggested ideas for "${lastGeneratedTopic}":` : `Blog Ideas for "${lastGeneratedTopic}":`}
          </h3>
          <ul className="space-y-3">
            {ideas.map((idea, index) => (
              <li key={index} className="flex items-start group hover:bg-white hover:bg-opacity-70 p-3 rounded-xl transition-all duration-200 backdrop-blur-sm">
                <div className="flex-shrink-0 h-6 w-6 text-indigo-600 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="flex-grow font-medium text-gray-800">{idea}</span>
                <button 
                  onClick={() => handleCopyIdea(idea)}
                  className={`ml-3 ${copied === idea ? 'text-green-600' : 'text-gray-400 group-hover:text-indigo-600'} hover:text-indigo-800 transition-colors`}
                  title={copied === idea ? "Copied!" : "Copy idea"}
                >
                  {copied === idea ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Browse Topics Modal */}
      {showTopicsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-indigo-100">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-indigo-500 to-purple-600">
              <h3 className="text-2xl font-bold text-white">Browse Blog Topics</h3>
              <button 
                onClick={() => setShowTopicsModal(false)}
                className="text-white hover:text-indigo-100 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Search Bar */}
            <div className="p-6 border-b border-gray-100 bg-indigo-50">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for topics..."
                  className="w-full px-5 py-4 pl-12 border-0 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all placeholder-indigo-300"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Categories and Topics */}
            <div className="flex flex-1 overflow-hidden">
              {/* Categories Sidebar */}
              <div className="w-1/4 border-r border-indigo-100 bg-indigo-50 overflow-y-auto">
                <nav className="flex flex-col">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`px-6 py-4 text-left transition-all duration-200 ${
                        activeCategory === category.id
                          ? 'bg-indigo-100 text-indigo-800 font-medium border-l-4 border-indigo-600'
                          : 'hover:bg-indigo-100 text-gray-700'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </nav>
              </div>
              
              {/* Topics Grid */}
              <div className="w-3/4 overflow-y-auto p-6 bg-white">
                {searchTerm && filteredTopics.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-lg">No topics found for "{searchTerm}"</p>
                    <p className="text-indigo-500 mt-2">Try a different search term</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredTopics.map((topic, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelectTopic(topic)}
                        className="p-4 bg-white border border-indigo-100 rounded-xl hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200 flex items-center group shadow-sm hover:shadow"
                      >
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3 group-hover:bg-indigo-200 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </div>
                        <span className="text-left text-gray-700 group-hover:text-indigo-800 font-medium transition-colors">{topic}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-white flex justify-end">
              <button
                onClick={() => setShowTopicsModal(false)}
                className="px-6 py-3 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl font-medium transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Notification Toast */}
      {copied && (
        <div className="fixed bottom-4 right-4 bg-indigo-600 text-white px-6 py-3 rounded-xl shadow-xl z-50 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copied to clipboard!
        </div>
      )}
    </div>
  );
};

export default BlogIdeaGenerator;