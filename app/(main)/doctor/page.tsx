
import { getCurrentUser } from "@/utils/actions/checkuser";
import {
  getDoctorAppointments,
  getDoctorAvailability,
} from "@/utils/actions/doctor";
import { redirect } from "next/navigation";
import React from "react";
import PageHeader from "@/components/common/PageHeader";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Calendar, Clock, ShieldCheck, User2 } from "lucide-react";
import { TabsContent } from "@radix-ui/react-tabs";
import Availabilitysetting from "./_components/Availabilitysetting";
import Appointmentlist from "./_components/Appointmentlist";

const page = async () => {
  const currentUser = await getCurrentUser();
  if (currentUser?.data?.user?.role !== "DOCTOR") {
    redirect("/onboarding");
  }

  const availabilityData = await getDoctorAvailability();
  const appointmentsData = await getDoctorAppointments();

  if (currentUser.data.user.verificationStatus !== "VERIFIED") {
    redirect("/doctor/verification");
  }
  return (
    <div className="py-20 px-10 container mx-auto">
      <PageHeader title="Doctor Dashboard" icon={<ShieldCheck />}></PageHeader>
      <div >
        <Tabs
          defaultValue="appointments"
          className="grid grid-cols-1 md:grid-cols-4 gap-6 "
        >
          <TabsList className="md:col-span-1 border-emerald-400/30 bg-emerald-900/20   h-14 md:h-28 flex sm:flex-row md:flex-col w-full p-2 md:p-5 rounded-md md:space-y-3 sm:space-x-2 md:space-x-0">
            <TabsTrigger
              className="transition-all ease-in-out flex-1 md:flex w-full md:items-center md:justify-center md:px-4 md:py-3"
              value="appointments"
            >
              <Calendar className="mr-2 h-4 w-4"></Calendar>
              <span>Appointments</span>
            </TabsTrigger>
            <TabsTrigger
              className="transition-all ease-in-out w-full flex-1 md:flex md:items-center md:justify-center md:px-4 md:py-3"
              value="availability"
            >
              <Clock className="mr-2 h-4 w-4"></Clock> <span>Availability</span>
            </TabsTrigger>
          </TabsList>

         <div className="md:col-span-3">
           <TabsContent className="border-none p-0" value="appointments">
            <Appointmentlist appointments={appointmentsData.data?.appointments || []}/>
          </TabsContent>
          <TabsContent className="border-none p-0" value="availability">
            <Availabilitysetting slots={availabilityData.data?.slots || []} />
          </TabsContent>
         </div>
        </Tabs>
      </div>
    </div>
  );
};

export default page;
