import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '../components/ui/button'

const PageNotFound = () => {
  const navigate = useNavigate()

  const goHome = () => {
    navigate('/')
  }

  return (
    <div className='h-full grid place-items-center text-center px-4'>
      <div>
        <h1 className='text-4xl font-bold text-[#E6BFA3]'>404</h1>
        <p className='text-[#58551E] mb-4'>Page not Found</p>
        <Button
          onClick={goHome}
          className='bg-[#58551E] '
        >
          <ArrowLeft />
          Go back to Home
        </Button>
      </div>
    </div>
  )
}

export default PageNotFound
