import React from 'react'
import BookiesLogo from "../assets/bookies_logo.png"
import { useAuth } from '../hooks/useAuth'

const Header = () => {
  const { config } = useAuth()
  return (
    <div className='flex justify-between items-center text-[#58551E]'>
      <div>
        <h1 className='text-2xl font-bold capitalize'>{config?.city} Bookies</h1>
        <p>Reading Community</p>
      </div>
      <div>
        <img
          src={BookiesLogo}
          className='size-15'
          alt="Bookies Logo"
        />
      </div>
    </div>
  )
}

export default Header