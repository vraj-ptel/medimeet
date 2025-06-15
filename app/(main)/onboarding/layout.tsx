import { currentUser } from '@/utils/actions/onboarding'
import { redirect } from 'next/navigation'
import { title } from 'process'
import React, { ReactNode } from 'react'

export const metaData={
    title:"onboarding",
    description:"complete your profile to get started with medimeet"
}

const layout = async({children}:{children:ReactNode}) => {
    const user=await currentUser();
  
    if(user){
        // handle unauthenticated user, e.g., redirect or return null
        if(user.user.role==="PATIENT"){
            redirect("/doctors")
        }else if(user.user.role==="DOCTOR"){
            if(user.user.verificationStatus==="VERIFIED"){
                redirect('/doctor')
            }else{
                redirect('/doctor/verification')
            }
        }else if(user.user.role==="ADMIN"){
            redirect('/admin')
        }
    }
  return (
    <div className='container w-full px-10 py-20 '>
      <div className='w-full  sm:max-w-4xl mx-auto'>
        <div className='text-center mb-10'>
            <h1 className='gradient-title text-3xl lg:text-4xl'>Welcome To Medimeet</h1>
            <p className='text-foreground/30'>Tell Us How You Want To Use The Platform</p>
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}

export default layout
