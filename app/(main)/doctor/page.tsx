import PageHeader from "@/components/common/PageHeader";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentUser } from "@/utils/actions/checkuser";
import {
  getDoctorAppointments,
  getDoctorAvailability,
} from "@/utils/actions/doctor";
import { getCompletedPayout, getDoctorIncomeDetails } from "@/utils/actions/payout";
import { TabsContent } from "@radix-ui/react-tabs";
import {
  Calendar,
  Clock,
  DollarSign,
  ShieldCheck
} from "lucide-react";
import { redirect } from "next/navigation";
import Appointmentlist from "./_components/Appointmentlist";
import Availabilitysetting from "./_components/Availabilitysetting";
import Earning from "./_components/Earning";

const page = async () => {
  const currentUser = await getCurrentUser();
  if (currentUser?.data?.user?.role !== "DOCTOR") {
    redirect("/onboarding");
  }

  const availabilityData = await getDoctorAvailability();
  const appointmentsData = await getDoctorAppointments();
  const doctorIncomeData = await getDoctorIncomeDetails(
    currentUser.data.user.id
  );
  const allPayouts=await getCompletedPayout()
  console.log("allPayoutsdddddddd", allPayouts);
  console.log("doctorIncomeData", doctorIncomeData);

  if (currentUser.data.user.verificationStatus !== "VERIFIED") {
    redirect("/doctor/verification");
  }
  return (
    <div className="py-20 px-10 container mx-auto">
      <PageHeader title="Doctor Dashboard" icon={<ShieldCheck />}></PageHeader>
      <div>
        <Tabs
          defaultValue="appointments"
          className="grid grid-cols-1 md:grid-cols-4 gap-6 "
        >
          <TabsList className="md:col-span-1 bg-none md:border-emerald-400/30 md:bg-emerald-900/20 gap-2   h-14 md:h-fit flex sm:flex-row md:flex-col w-full p-2 md:p-5 rounded-md md:space-y-3 sm:space-x-2 md:space-x-0">
            <TabsTrigger
              className="transition-all ease-in-out flex-1 md:flex w-full md:items-center md:justify-center md:px-4 md:py-3"
              value="appointments"
            >
              <Calendar className="hidden md:block mr-2 h-4 w-4"></Calendar>
              <span>Appointments</span>
            </TabsTrigger>
            <TabsTrigger
              className="transition-all ease-in-out w-full flex-1 md:flex md:items-center md:justify-center md:px-4 md:py-3"
              value="availability"
            >
              <Clock className="hidden md:block mr-2 h-4 w-4"></Clock> <span>Availability</span>
            </TabsTrigger>
            <TabsTrigger
              className="transition-all ease-in-out w-full flex-1 md:flex md:items-center md:justify-center md:px-4 md:py-3"
              value="earning"
            >
              <DollarSign className="hidden md:block mr-2 h-4 w-4" /> <span>Earning</span>
            </TabsTrigger>
          </TabsList>

          <div className="md:col-span-3">
            <TabsContent className="border-none p-0" value="appointments">
              <Appointmentlist
                appointments={appointmentsData.data?.appointments || []}
              />
            </TabsContent>
            <TabsContent className="border-none p-0" value="availability">
              <Availabilitysetting slots={availabilityData.data?.slots || []} />
            </TabsContent>
            <TabsContent className="border-none p-0" value="earning">
              <Earning
                allPayouts={allPayouts.data?.completedPayOut|| []}
                displayTotalEarning={doctorIncomeData.data?.displayTotalEaring ?? 0}
                avgWeeklyEarning={
                  doctorIncomeData.data?.avgWeeklyEarningInThisMonth ?? 0
                }
                thisMonthEarning={doctorIncomeData.data?.thisMonthEarning ?? 0}
                totalEarning={doctorIncomeData.data?.totalEarning ?? 0}
                totalCredit={doctorIncomeData.data?.totalCredits ?? 0}
                totalAppointments={
                  doctorIncomeData.data?.totalAppointments ?? 0
                }
                totalPayOutEarning={
                  doctorIncomeData.data?.totalPayOutEarning ?? 0
                }
                totalPlatFormFee={doctorIncomeData.data?.totalPlatformFee ?? 0}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default page;
