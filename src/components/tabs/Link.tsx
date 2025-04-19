import React, { useEffect, useState } from 'react'
import Scanner from '../Scanner'
import { Stepper } from 'react-form-stepper'
import { useApp } from '../../hooks/useApp'
import { useAuth } from '../../hooks/useAuth'
import { MemberData } from '../../types'
import { DATA_RESPONSE_KEYS, TOAST_STYLES } from '../../utils/constants'
import { toast } from 'sonner'
import { Input } from '../../components/ui/input'
import { Button } from '../ui/button'

const Link = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [member, setMember] = useState<MemberData | null>(null)
  const [email, setEmail] = useState('')
  const { qrScanData, linkBookiesID, masterData, setQRScanData, setQRScanPauseState } = useApp()
  const { config } = useAuth()

  useEffect(() => {
    (async () => {
      if (!qrScanData || !Array.isArray(masterData) || !config) return;

      setQRScanPauseState(true)

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

        setQRScanPauseState(false)
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

        setQRScanPauseState(false)
        setQRScanData(null);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrScanData, masterData, config]);

  const handleEmailInput = (email: string) => {
    if (!email || !Array.isArray(masterData)) return

    const foundMember = masterData.find(
      (m: MemberData) => m[DATA_RESPONSE_KEYS.EMAIL] === email
    )

    if (!foundMember) {
      toast.error(`No data found for ${email}`, { style: TOAST_STYLES.ERROR })
    } else {
      setMember(foundMember)
      setActiveStep(1)
      setEmail('')
    }
  }

  return (
    <div className='flex flex-col h-full'>
      <div>
        <Scanner />
      </div>

      {activeStep == 0 && (
        <div className='mt-5 space-y-2'>
          <p className='text-sm font-medium text-center'>OR</p>
          <div className='flex'>
            <Input
              placeholder="Enter Email Manually"
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleEmailInput(email)
                }
              }}
              className="bg-gray-100 px-10 p-6 rounded-r-none focus-visible:ring-0 focus-visible:border-1"
            />
            <Button
              className='p-6 border-1 border-transparent bg-[#58551E] rounded-l-none'
              onClick={() => handleEmailInput(email)}
            >
              Add
            </Button>
          </div>
        </div>
      )}

      <div className='flex-1 grid place-items-center'>
        <div className='w-full px-4 max-w-md'>
          <Stepper
            steps={[{ label: 'Scan or Enter Email' }, { label: 'Scan Library Card QR' }]}
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

          {/* {activeStep === 0 && (
            <div className='mt-6 space-y-4'>
              <label className='block text-sm font-medium text-gray-700'>Or enter email manually</label>
              <Input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='example@email.com'
              />
              <button
                onClick={() => handleEmailInput(email)}
                className='bg-[#58551E] text-white py-2 px-4 rounded-lg hover:bg-[#444219]'
              >
                Submit Email
              </button>
            </div>
          )} */}
        </div>
      </div>
    </div>
  )
}

export default Link
