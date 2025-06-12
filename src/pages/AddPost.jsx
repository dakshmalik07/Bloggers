import React, { useState, useEffect } from 'react'
import { PostForm, Container } from '../components'

function AddPost() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Mouse Follower Effect */}
      <div 
        className="absolute w-96 h-96 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl pointer-events-none transition-all duration-1000 ease-out"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      ></div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <div className={`relative z-10 py-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <Container>
          <div className="max-w-6xl mx-auto">
            {/* Hero Header Section */}
            <div className="mb-16 text-center relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl opacity-0 animate-pulse"></div>
              
              <div className="relative">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl mb-8 shadow-2xl shadow-purple-500/25">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                </div>

                <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6 leading-tight">
                  Create Your Story
                </h1>
                
                <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                  Transform your ideas into compelling narratives. Share your unique perspective with the world and inspire others through the power of words.
                </p>

                {/* Animated Divider */}
                <div className="flex justify-center mt-12">
                  <div className="w-32 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full"></div>
                </div>
              </div>
            </div>
            
            {/* Main Form Container */}
            <div className="group relative mb-16">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-slate-900/30 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-1 shadow-2xl">
                <div className="bg-slate-900/40 rounded-3xl p-8">
                  <PostForm />
                </div>
              </div>
            </div>
            
            {/* Enhanced Writing Tips Section */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Writing Tips */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                <div className="relative bg-slate-900/40 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-6 flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mr-4">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    Writing Excellence
                  </h3>
                  
                  <div className="space-y-4">
                    {[
                      {
                        icon: "✨",
                        title: "Compelling Headlines",
                        desc: "Craft attention-grabbing titles that spark curiosity"
                      },
                      {
                        icon: "🎨",
                        title: "Visual Impact",
                        desc: "Include high-quality images that complement your story"
                      },
                      {
                        icon: "📝",
                        title: "Structure Matters",
                        desc: "Use headings and paragraphs for better readability"
                      }
                    ].map((tip, index) => (
                      <div key={index} className="flex items-start p-4 bg-slate-800/30 rounded-2xl border border-slate-700/30 hover:border-blue-500/30 transition-colors duration-300">
                        <div className="text-2xl mr-4 mt-1">{tip.icon}</div>
                        <div>
                          <h4 className="font-semibold text-white mb-1">{tip.title}</h4>
                          <p className="text-slate-300 text-sm">{tip.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Content Guidelines */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                <div className="relative bg-slate-900/40 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent mb-6 flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mr-4">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    Content Guidelines
                  </h3>
                  
                  <div className="space-y-4">
                    {[
                      {
                        icon: "🎯",
                        title: "Stay Focused",
                        desc: "Keep your content relevant and on-topic"
                      },
                      {
                        icon: "🔍",
                        title: "Quality Research",
                        desc: "Back up your claims with credible sources"
                      },
                      {
                        icon: "💡",
                        title: "Original Ideas",
                        desc: "Share your unique perspective and insights"
                      }
                    ].map((guideline, index) => (
                      <div key={index} className="flex items-start p-4 bg-slate-800/30 rounded-2xl border border-slate-700/30 hover:border-green-500/30 transition-colors duration-300">
                        <div className="text-2xl mr-4 mt-1">{guideline.icon}</div>
                        <div>
                          <h4 className="font-semibold text-white mb-1">{guideline.title}</h4>
                          <p className="text-slate-300 text-sm">{guideline.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Inspiration Quote */}
            <div className="mt-16 text-center">
              <div className="group relative inline-block">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl blur-2xl group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-all duration-500"></div>
                <blockquote className="relative text-2xl font-light text-slate-300 italic leading-relaxed">
                  "The best stories are the ones that connect us to our shared humanity."
                </blockquote>
                <div className="mt-4 w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto"></div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default AddPost