/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { useApp } from '../../hooks/useApp'
import { Card, CardContent } from '../ui/card'
import { DATA_RESPONSE_KEYS, TOAST_STYLES } from '../../utils/constants'
import dayjs from "dayjs"
import SearchBar from '../SearchBar'
import { useAuth } from '../../hooks/useAuth'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table"


const List = () => {
  const [memberAttendanceData, setMemberAttendanceData] = useState(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { attendanceData, searchKey, getMemberAttendance, setSearchKey } = useApp()
  const { allCitiesConfig } = useAuth()

  useEffect(() => {
    (async () => {
      if (searchKey && allCitiesConfig) {
        setIsLoading(true)
        const res = await getMemberAttendance(allCitiesConfig, searchKey)

        if (res.length == 0) {
          toast.error(`No data found for ${searchKey}`, { style: TOAST_STYLES.ERROR });
          setSearchKey(null)
          setIsLoading(false)
          return
        }

        setMemberAttendanceData(res)
        setIsLoading(false)
      }
    })()

    return () => setMemberAttendanceData(null)
  }, [searchKey, allCitiesConfig]);
  return (
    <>
      <SearchBar />

      <div className='flex flex-col bg-white h-full max-h-[calc(100%-50px)] rounded-2xl p-4 space-y-2 mt-2'>
        {!searchKey ? (
          <>
            <div className='flex justify-between items-center'>
              <div>
                <h1 className=''>Recent Check-ins</h1>
              </div>
              <div className='border-[#58551E] border-1 py-1 px-4 w-fit rounded-full text-sm'>
                <span className='text-[#58551E]'>{attendanceData?.length} Total</span>
              </div>
            </div>

            <div className='flex-1 max-h-[calc(100vh-320px)] overflow-y-auto space-y-2'>
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
          </>
        ) : (!isLoading ?
          (
            <div className='p-4 space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto'>
              {[
                { field: 'Name', value: memberAttendanceData?.[0]?.[DATA_RESPONSE_KEYS?.NAME] },
                { field: 'Bookies ID', value: memberAttendanceData?.[0]?.[DATA_RESPONSE_KEYS?.BOOKIES_ID] },
                { field: 'Total Attended Sessions', value: memberAttendanceData?.length },
                { field: 'First Session', value: `${memberAttendanceData?.[memberAttendanceData.length - 1]?.city} : ${dayjs(memberAttendanceData?.[memberAttendanceData.length - 1]?.[DATA_RESPONSE_KEYS.TIMESTAMP]).format('ddd DD/MM/YYYY')}` },
              ].map((e, i) => (
                <div key={i}>
                  <p className='text-sm text-[#58551E]'>{e.field}</p>
                  <h1 className='text-xl font-bold'>{e.value}</h1>
                </div>
              ))}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>City</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {memberAttendanceData?.map((e: any, i: number) => (
                    <TableRow key={i}>
                      <TableCell>{e?.city}</TableCell>
                      <TableCell>{dayjs(e?.[DATA_RESPONSE_KEYS.TIMESTAMP]).format('ddd DD/MM/YYYY')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : "Loading...")
        }
      </div>
    </>
  )
}

export default List
