import Appointmentcard from '@/components/common/Appointmentcard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Appointment } from '@/lib/generated/prisma'
import { Calendar } from 'lucide-react'

const Appointmentlist = ({appointments}:{appointments:Appointment[]}) => {
  return (
    <Card className='bg-emerald-900/20 border-emerald-400/30'>
      <CardHeader>
        <CardTitle className='flex flex-row md:text-2xl gap-2 items-center font-bold text-white'>
          <Calendar className='h-5 w-5 text-emerald-400 flex gap-2'></Calendar>
          Upcoming Appointments
        </CardTitle>
      </CardHeader>
      <CardContent>
        {appointments.length>0?<div className='space-y-4'>
          {appointments.map((appointment)=>{
            return <div key={appointment.id}>

              <Appointmentcard appointment={appointment} userRole='DOCTOR'/>
            </div>
          })}
        </div>:<div className='text-center py-8'>
          <Calendar></Calendar>
          <h3>No Appointment Data</h3>
          <p className='capitalize'>you don't have any upcoming appointments</p>
          </div>}
      </CardContent>
    </Card>
  )
}

export default Appointmentlist
