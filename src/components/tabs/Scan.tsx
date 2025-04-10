import React, { useEffect } from 'react'
import Scanner from '../Scanner'
import { Loader, ScanQrCode } from 'lucide-react'
import { useApp } from '../../hooks/useApp'
import { CONFIG_RESPONSE_KEYS, DATA_RESPONSE_KEYS, TOAST_STYLES } from '../../utils/constants'
import { useAuth } from '../../hooks/useAuth'
import { MemberData } from '../../types'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

const Scan = () => {
  const { config, allCitiesConfig, updateMasterSheetEP } = useAuth()
  const { masterData, qrScanData, setQRScanData, registerAttendance, attendanceData, isAttendanceDataLoading } = useApp()

  useEffect(() => {
    (async () => {
      if (!qrScanData || !Array.isArray(masterData) || !config || !attendanceData) return;

      const member = masterData.find(
        (m: MemberData) =>
          m[DATA_RESPONSE_KEYS.BOOKIES_ID] === qrScanData ||
          m[DATA_RESPONSE_KEYS.EMAIL] === qrScanData
      );

      if (!member) {
        toast.error(`No data found for ${qrScanData}`, { style: TOAST_STYLES.ERROR });
        setQRScanData(null);
        return;
      }

      const alreadyRegistered = attendanceData.some((att: MemberData) =>
        att[DATA_RESPONSE_KEYS.BOOKIES_ID] === member[DATA_RESPONSE_KEYS.BOOKIES_ID]
      );

      if (alreadyRegistered) {
        toast.warning(`Attendance already registered for ${qrScanData}`, { style: TOAST_STYLES.WARNING });
        setQRScanData(null);
        return;
      }

      const res = await registerAttendance(config, {
        bookiesId: member[DATA_RESPONSE_KEYS.BOOKIES_ID],
        name: member[DATA_RESPONSE_KEYS.NAME],
        email: member[DATA_RESPONSE_KEYS.EMAIL],
        phone: String(member[DATA_RESPONSE_KEYS.PHONE_NUMBER]),
      });

      if (res?.success) {
        toast.success(`Attendance successfully registered for ${qrScanData}`, { style: TOAST_STYLES.SUCCESS });
      } else {
        toast.error(res?.error || "Something went wrong", { style: TOAST_STYLES.ERROR });
      }

      setQRScanData(null);
    })()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrScanData, masterData, attendanceData, config]);

  return (
    <div className="flex flex-col h-full">
      <div>
        <Scanner />
      </div>

      <div className='mt-2'>
        <Select defaultValue={config?.database} onValueChange={updateMasterSheetEP}>
          <SelectTrigger className="w-fit bg-gray-100 p-6 text-left text-base focus:ring-0 focus:ring-offset-0 border border-transparent focus:border-transparent">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {allCitiesConfig?.map((e, i) => (
              <SelectItem key={i} value={e[CONFIG_RESPONSE_KEYS.CITY]} className="text-base">{e[CONFIG_RESPONSE_KEYS.CITY]} Database</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 grid place-items-center">
        <div className="flex gap-2 text-[#58551E]">
          {!isAttendanceDataLoading ? (
            <>
              <ScanQrCode />
              <p>Scan QR Code</p>
            </>
          ) : (
            <>
              <Loader />
              <p>Fetching Details</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scan;
