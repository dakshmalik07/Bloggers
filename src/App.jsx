import { use, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import { useDispatch } from 'react-redux'
import viteLogo from '/vite.svg'
import './App.css'
import authService  from './appwrite/auth'
import{login,logout} from "./store/authSlice"
import { Header,Footer } from "./components";
import { Outlet } from 'react-router-dom'


function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    authService.currentUser()
    .then((userData) => {
      if (userData) {
        dispatch(login({userData}))
      } else {
        dispatch(logout())
      }
    })
    .finally(() => setLoading(false))
  }, [])
  
  return !loading ? (
    <div className='min-h-screen flex flex-wrap content-between bg-gray-400'>
      <div className='w-full block'>
        <Header />
        <main>
        <Outlet />
        </main>
       
      </div>
    </div>
  ) : null
}

export default App
