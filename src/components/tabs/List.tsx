import React from 'react'
import { useApp } from '../../hooks/useApp'
import { Card, CardContent } from '../ui/card'
import { DATA_RESPONSE_KEYS } from '../../utils/constants'
import dayjs from "dayjs"

const List = () => {
  const { attendanceData } = useApp()

  return (
    <div className='flex flex-col bg-white h-full rounded-2xl p-4 space-y-2'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className=''>Recent Check-ins</h1>
        </div>
        <div className='border-[#58551E] border-1 py-1 px-4 w-fit rounded-full text-sm'>
          <span className='text-[#58551E]'>{attendanceData?.length} Total</span>
        </div>
      </div>

      <div className='flex-1 max-h-[calc(100vh-260px)] overflow-y-auto space-y-2'>
        {attendanceData?.slice().reverse().map((e) => (
          <Card key={e[DATA_RESPONSE_KEYS.BOOKIES_ID]} className='shadow-none'>
            <CardContent className='flex justify-between'>
              <div>
                <h1 className='text-lg font-bold'>{e[DATA_RESPONSE_KEYS.NAME]}</h1>
                <p className='text-sm text-[#58551E]'>{e[DATA_RESPONSE_KEYS.BOOKIES_ID]}</p>
              </div>
              <div>
                <p className='text-sm'>{dayjs(e[DATA_RESPONSE_KEYS.TIMESTAMP]).format("hh:mm A")}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default List
