import React, { useEffect, useState } from 'react'
import Scanner from '../Scanner'
import { Stepper } from 'react-form-stepper'
import { useApp } from '../../hooks/useApp'
import { useAuth } from '../../hooks/useAuth'
import { MemberData } from '../../types'
import { DATA_RESPONSE_KEYS, TOAST_STYLES } from '../../utils/constants'
import { toast } from 'sonner'

const Link = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [member, setMember] = useState<MemberData | null>(null)
  const { qrScanData, linkBookiesID, masterData, setQRScanData } = useApp()
  const { config } = useAuth()

  useEffect(() => {
    (async () => {
      if (!qrScanData || !Array.isArray(masterData) || !config) return;

      if (activeStep === 0) {
        const foundMember = masterData.find(
          (m: MemberData) => m[DATA_RESPONSE_KEYS.EMAIL] === qrScanData
        );

        if (!foundMember) {
          toast.error(`No data found for ${qrScanData}`, { style: TOAST_STYLES.ERROR });
        } else {
          setMember(foundMember);
          setActiveStep(1);
        }

        setQRScanData(null);
      } else if (activeStep === 1 && member) {
        setActiveStep(2);

        const res = await linkBookiesID(config, {
          bookiesId: qrScanData,
          email: member[DATA_RESPONSE_KEYS.EMAIL],
        });

        if (res?.success) {
          toast.success(`${member[DATA_RESPONSE_KEYS.EMAIL]} Successfully Linked with ${qrScanData}`, { style: TOAST_STYLES.SUCCESS });

          setTimeout(() => {
            setActiveStep(0);
            setMember(null);
          }, 1000);
        } else {
          toast.error(res?.error || "Something went wrong", { style: TOAST_STYLES.ERROR });
        }

        setQRScanData(null);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrScanData, masterData, config]);

  return (
    <div className='flex flex-col h-full'>
      <div>
        <Scanner />
      </div>

      <div className='flex-1 grid place-items-center'>
        <div className='w-full'>
          <Stepper
            steps={[{ label: 'Scan Email QR' }, { label: 'Scan Library Card QR' }]}
            activeStep={activeStep}
            styleConfig={{
              activeBgColor: '#58551E',
              activeTextColor: '#fff',
              completedBgColor: 'green',
              completedTextColor: '#fff',
              inactiveBgColor: '#e5e7eb',
              inactiveTextColor: '#9ca3af',
              size: '2.55rem',
              circleFontSize: '1em',
              labelFontSize: '0.875em',
              borderRadius: '50%',
              fontWeight: 500,
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Link
