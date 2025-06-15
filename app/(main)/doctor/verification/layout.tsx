import PageHeader from '@/components/common/PageHeader'
import { Stethoscope } from 'lucide-react'
import React from 'react'

const layout = ({children}:{children:React.ReactNode}) => {
  return (
    <div className='py-20  px-10'>
        <PageHeader title="Doctor Dashboard" icon={<Stethoscope/>}/>
      {children}
    </div>
  )
}

export default layout
