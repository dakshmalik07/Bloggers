import React, { useState } from 'react'
import { Container, Logo } from '../index'
import { Logoutbtn } from '../index'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    {
      name: 'Home',
      slug: "/",
      active: true
    }, 
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
    },
    {
      name: "All Posts",
      slug: "/all-posts",
      active: authStatus,
    },
    {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
    },
  ]

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header className='py-4 shadow-lg bg-gradient-to-r from-blue-600 to-indigo-700 sticky top-0 z-50'>
      <Container>
        <nav className='flex items-center justify-between'>
          <div className='flex items-center'>
            <Link to='/' className='flex items-center'>
              
              <span className='ml-2 text-xl font-bold text-white hidden md:block'>TechOffside</span>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className='md:hidden text-white focus:outline-none'
            onClick={toggleMobileMenu}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {mobileMenuOpen ? 
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> :
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
          
          {/* Desktop Navigation */}
          <ul className='hidden md:flex items-center space-x-1'>
            {navItems.map((item) => 
              item.active ? (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className='inline-block px-4 py-2 font-medium text-white hover:bg-blue-500 hover:text-white rounded-md transition-all duration-200'
                  >
                    {item.name}
                  </button> 
                </li>
              ) : null
            )}
            {authStatus && (
              <li>
                <Logoutbtn />
              </li>
            )}
          </ul>
        </nav>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className='md:hidden mt-4 bg-white rounded-lg shadow-xl'>
            <ul className='py-2'>
              {navItems.map((item) => 
                item.active ? (
                  <li key={item.name}>
                    <button
                      onClick={() => {
                        navigate(item.slug)
                        setMobileMenuOpen(false)
                      }}
                      className='w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors'
                    >
                      {item.name}
                    </button> 
                  </li>
                ) : null
              )}
              {authStatus && (
                <li className='px-4 py-2'>
                  <Logoutbtn />
                </li>
              )}
            </ul>
          </div>
        )}
      </Container>
    </header>
  )
}

export default Header