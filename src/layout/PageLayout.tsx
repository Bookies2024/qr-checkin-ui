import React from 'react'
import Header from '../components/Header'

interface PageLayoutProps {
  children: React.ReactNode
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className='h-screen flex flex-col gap-2'>
      <div>
        <Header />
      </div>

      <div className='flex-1'>
        {children}
      </div>
    </div>
  )
}

export default PageLayout