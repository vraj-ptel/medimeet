import React from 'react'
import VideoCall from './_components/VideoCall'

const page = async({searchParams}:{searchParams:Promise<{appointmentId:string,token:string,sessionId:string}>}) => {
  const {appointmentId,token,sessionId}=await searchParams
  return (
    <div className='py-20'>
      <VideoCall sessionId={sessionId} token={token}/>
    </div>
  )
}

export default page
