import { useState } from "react"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Lock, Eye, EyeOff } from "lucide-react"
import BookiesLogo from "../assets/bookies_logo.png"
import { useAuth } from "../hooks/useAuth"
import { toast } from "sonner"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select"
import { useApp } from "../hooks/useApp"
import { useNavigate } from "react-router-dom"
import { TOAST_STYLES } from "../utils/constants"

const Auth = () => {
  const { cities, isCitiesLoading } = useApp();
  const { login, isLoginLoading } = useAuth()
  const [passkey, setPasskey] = useState("")
  const [showPasskey, setShowPasskey] = useState(false)
  const [selectedCity, setSelectedCity] = useState<string | undefined>()
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!selectedCity) {
      toast.error("Please Select a City", { style: TOAST_STYLES.ERROR })
      return
    }

    if (!passkey.trim()) {
      toast.error(`Please Enter Passkey for ${selectedCity}`, { style: TOAST_STYLES.ERROR })
      return
    }

    const success = await login(selectedCity, passkey)

    if (success) {
      toast.success("Logged in successfully", { style: TOAST_STYLES.SUCCESS })
      navigate('/')
    } else {
      toast.error("Invalid passkey", { style: TOAST_STYLES.ERROR, })
    }
  }

  const togglePasskeyVisibility = () => setShowPasskey(prev => !prev)

  return (
    <div className="flex-1 h-full grid place-items-center text-center px-4">
      <div className="w-full">
        {isCitiesLoading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#58551E]" />
            <p className="mt-4 text-[#58551E]">Loading...</p>
          </div>
        ) : (
          <div className="-mt-16 space-y-10">
            <div className="grid place-items-center">
              <img src={BookiesLogo} alt="Bookies Logo" className="h-24" />
              <h1 className="text-2xl font-bold text-[#58551E] mt-4 uppercase">
                {`${selectedCity || "Mumbai"} Bookies`}
              </h1>
              <p className="text-sm text-[#58551E]">QR-Checkin</p>
            </div>

            <Card className="rounded-2xl shadow-sm w-full py-8">
              <CardContent className="space-y-4">
                <div className="grid place-items-center space-y-1">
                  <Lock className="size-10 text-[#58551E]" />
                </div>

                <Select onValueChange={setSelectedCity}>
                  <SelectTrigger className="w-full bg-gray-100 p-6 text-left text-base">
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities?.map((city) => (
                      <SelectItem key={city} value={city} className="text-base">
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="relative">
                  <Input
                    placeholder="Enter the Passkey"
                    type={showPasskey ? "text" : "password"}
                    className="bg-gray-100 px-10 p-6"
                    value={passkey}
                    onChange={(e) => setPasskey(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleLogin()
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={togglePasskeyVisibility}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPasskey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                <Button
                  disabled={isLoginLoading}
                  className="w-full bg-[#58551E] hover:bg-[#3a3400] text-white p-6"
                  onClick={handleLogin}
                >
                  Continue
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )

}

export default Auth
