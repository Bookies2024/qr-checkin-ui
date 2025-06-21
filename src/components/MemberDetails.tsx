/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { DATA_RESPONSE_KEYS } from '../utils/constants';
import dayjs from 'dayjs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface MemberDetailsProps {
  memberDetails: any;
}

const MemberDetails: React.FC<MemberDetailsProps> = ({ memberDetails }) => {
  const sortedSessions = memberDetails?.attendedSessions?.sort((a: any, b: any) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className='space-y-4'>
      {[
        { field: 'Name', value: `${memberDetails?.[DATA_RESPONSE_KEYS.FIRST_NAME]} ${memberDetails?.[DATA_RESPONSE_KEYS.LAST_NAME]}` },
        { field: 'Bookies ID', value: memberDetails?.[DATA_RESPONSE_KEYS.BOOKIES_ID] },
        { field: 'Total Attended Sessions', value: memberDetails?.attendedSessions?.length },
        {
          field: 'First Session',
          value: (sortedSessions?.length > 0) ? `${sortedSessions?.[sortedSessions?.length - 1]?.city} : ${dayjs(sortedSessions?.[sortedSessions?.length - 1]?.timestamp).format('ddd DD/MM/YYYY')}` : '',
        },
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
          {sortedSessions?.map((e: any, i: number) => (
            <TableRow key={i}>
              <TableCell>{e?.city}</TableCell>
              <TableCell>{dayjs(e?.timestamp).format('ddd DD/MM/YYYY')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MemberDetails;