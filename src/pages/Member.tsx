import React from 'react'
import { useParams } from 'react-router-dom'

const Member = () => {
  const { memberId } = useParams()
  return (
    <div>
      <h1 className='text-2xl font-bold'>Under Construction :)</h1>
      <p>you'll be able to see your matrics here <span className='font-bold'>{memberId}</span></p>

    </div>
  )
}

export default Member