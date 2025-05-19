/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { useApp } from '../../hooks/useApp'
import { Card, CardContent } from '../ui/card'
import { DATA_RESPONSE_KEYS } from '../../utils/constants'
import dayjs from "dayjs"
import SearchBar from '../SearchBar'
import { ChevronLeft } from 'lucide-react'
import MemberDetails from '../MemberDetails'

const List: React.FC = () => {
  const [memberDetails, setMemberDetails] = useState<any>(null);
  const [searchParam, setSearchParam] = useState({ bookiesId: '', homeCity: '' });
  const { recentCheckins, isRecentCheckinsLoading, getMemberDetails, isGetMemberDetailsLoading } = useApp();

  useEffect(() => {
    (async () => {
      if (searchParam.bookiesId) {
        const res = await getMemberDetails(searchParam.bookiesId, searchParam.homeCity);
        if (res) {
          setMemberDetails(res);
        }
      } else {
        setMemberDetails(null);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParam.bookiesId]);

  return (
    <>
      <SearchBar setSearchParam={setSearchParam} searchParam={searchParam} />

      <div className='flex flex-col bg-white h-full max-h-[calc(100%-50px)] rounded-2xl p-4 space-y-2 mt-2'>
        {!(memberDetails || searchParam.bookiesId) ? (
          <>
            <div className='flex justify-between items-center mb-4'>
              <div>
                <h1 className='font-medium'>Recent Check-ins</h1>
              </div>
              <div className='border-[#58551E] border-1 py-1 px-4 w-fit rounded-full text-sm'>
                <span className='text-[#58551E]'>{recentCheckins?.length} Total</span>
              </div>
            </div>

            <div className='flex-1 max-h-[calc(100vh-320px)] overflow-y-auto space-y-2'>
              {!isRecentCheckinsLoading ? (
                recentCheckins?.slice().reverse().map((e) => (
                  <Card key={e[DATA_RESPONSE_KEYS.BOOKIES_ID]} className='shadow-none' onClick={() => setMemberDetails(e)}>
                    <CardContent className='flex justify-between'>
                      <div>
                        <h1 className='text-lg font-bold'>{`${e[DATA_RESPONSE_KEYS.FIRST_NAME]} ${e[DATA_RESPONSE_KEYS.LAST_NAME]}`}</h1>
                        <p className='text-sm text-[#58551E]'>Bookies ID: {e[DATA_RESPONSE_KEYS.BOOKIES_ID]}</p>
                      </div>
                      <div>
                        <p className='text-sm'>{dayjs(e[DATA_RESPONSE_KEYS.TIMESTAMP]).format("hh:mm A")}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : "Loading..."}
            </div>
          </>
        ) : (!isGetMemberDetailsLoading ?
          (
            <>
              {!searchParam.bookiesId && (
                <div className='-mb-1 p-1' onClick={() => setMemberDetails(null)}>
                  <ChevronLeft />
                </div>
              )}

              {memberDetails ? (
                <div className='p-4 space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto'>
                  <MemberDetails memberDetails={memberDetails} />
                </div>
              ) : ("No data found")}
            </>
          ) : "Loading...")
        }
      </div>
    </>
  );
}

export default List;