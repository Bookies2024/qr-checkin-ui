import React from 'react'
import Scanner from '../Scanner'
import { ScanQrCode } from 'lucide-react'
import { useApp } from '../../hooks/useApp'
import { TOAST_STYLES } from '../../utils/constants'
import { useAuth } from '../../hooks/useAuth'
import { toast } from 'sonner'
import { IDetectedBarcode } from '@yudiel/react-qr-scanner'

const Scan: React.FC = () => {
  const { currentCity } = useAuth()
  const { setIsQRScanPaused, registerAttendance } = useApp()

  const handleScan = async (result: IDetectedBarcode[] | null) => {
    setIsQRScanPaused(true)

    const [, city, bookiesId] = result[0].rawValue.split('/');
    if (!city || !bookiesId) { toast.error(`Invalid QR`, { style: TOAST_STYLES.ERROR }); setIsQRScanPaused(false); return }

    const res = await registerAttendance({
      bookiesId: bookiesId,
      homeCity: city,
      city: currentCity,
    });

    if (res?.success) {
      toast.success(res?.message, { style: TOAST_STYLES.SUCCESS });
    } else {
      toast.error(res?.error, { style: TOAST_STYLES.ERROR });
    }

    setIsQRScanPaused(false)
  }

  return (
    <div className="flex flex-col h-full">
      <div>
        <Scanner onScan={handleScan} />
      </div>

      <div className="flex-1 grid place-items-center">
        <div className="flex gap-2 text-[#58551E]">
          <ScanQrCode />
          <p>Scan QR Code</p>
        </div>
      </div>
    </div>
  );
};

export default Scan;
