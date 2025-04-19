import React, { useState, useEffect } from 'react'
import { Input } from './ui/input'
import { Search, ScanQrCode, X } from 'lucide-react'
import { Button } from './ui/button'
import { useApp } from '../hooks/useApp'
import Scanner from './Scanner'

const SearchBar = () => {
  const { setSearchKey, qrScanData, setQRScanData } = useApp()
  const [inputValue, setInputValue] = useState<string | null>(null)
  const [scannerOpen, setScannerOpen] = useState<boolean>(false)

  useEffect(() => {
    if (qrScanData) {
      setInputValue(qrScanData)
      setQRScanData(null)
      setScannerOpen(false)
    }
  }, [qrScanData]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setSearchKey(inputValue)
    }, 2000)

    return () => clearTimeout(delayDebounce)
  }, [inputValue, setSearchKey])

  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />

      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter Bookies ID"
        className="bg-white p-6 rounded-full focus-visible:ring-0 focus-visible:border-1"
        style={{ paddingInline: '40px' }}
      />

      {inputValue ? (
        <Button
          type="button"
          className="h-8 w-8 bg-transparent border-none shadow-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          onClick={() => setInputValue('')}
        >
          <X className="size-5 text-[#58551E]" />
        </Button>
      ) : (
        <Button
          type="button"
          className="h-8 w-8 bg-transparent border-none shadow-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          onClick={() => setScannerOpen(true)}
        >
          <ScanQrCode className="size-6 text-[#58551E]" />
        </Button>
      )}

      {scannerOpen && (
        <div className="fixed inset-0 z-50 bg-[#FFE6D5] bg-opacity-90 p-4 pt-20">
          <div className="absolute top-4 right-4">
            <Button
              onClick={() => setScannerOpen(false)}
              className="text-[#58551E] bg-transparent hover:bg-white/10"
            >
              <X className="size-6" />
            </Button>
          </div>
          <div>
            <Scanner />
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBar