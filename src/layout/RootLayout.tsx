import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="bg-[#FFE6D5] h-screen flex flex-col p-4">
      <Outlet />
    </div>
  )
}

export default RootLayout