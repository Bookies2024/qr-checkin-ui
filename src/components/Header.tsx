import React, { useState } from 'react'
import BookiesLogo from "../assets/bookies_logo.png"
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "../components/ui/dialog"

const Header: React.FC = () => {
  const { config, logout } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const handleLogoClick = () => {
    setIsModalOpen(true)
  }

  const handleLogout = () => {
    logout()
    setIsModalOpen(false)
  }

  return (
    <div className='flex justify-between items-center text-[#58551E]'>
      <div>
        <h1 className='text-2xl font-bold capitalize'>{config?.city} Bookies</h1>
        <p>Reading Community</p>
      </div>
      <div>
        <img
          src={BookiesLogo}
          className='size-15 cursor-pointer'
          alt="Bookies Logo"
          onClick={handleLogoClick}
        />
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='w-[60%]'>
          <DialogHeader>
            <DialogDescription className='text-start'>
              Do you want to logout?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button className='p-6 bg-[#ef4444]' onClick={handleLogout}>
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Header
