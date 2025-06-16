"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle
} from "@/components/ui/card";
import useFetch from "@/hooks/useFetch";
import { onboardUser } from "@/utils/actions/onboarding";

import { Loader2, Stethoscope, User2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import DoctorForm from "./_component/DoctorForm";

export type Step = "choose-role" | "doctor-form";
// In your /onboarding/page.js
export const dynamic = 'force-dynamic'; // Force dynamic rendering

const page = () => {
  const router=useRouter()
  const [step, setStep] = useState<Step>("choose-role");
  const {fn,data:selectRoleData,error,isLoading}=useFetch(onboardUser)
  
  const handlePatientSelection=async()=>{
      if(isLoading){
        return
      }
      const formData=new FormData();
      formData.append("role","PATIENT")
     await  fn(formData)
  }

  useEffect(()=>{
    if(selectRoleData?.success){
      router.push('/doctors')
      toast.success('Successfully onboarded as a role you selected');
    }
  },[selectRoleData])

 

  if (step === "choose-role") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-emerald-400/30 bg-emerald-900/10 hover:bg-emerald-900/20 transition-all">
          <CardContent className="flex flex-col gap-4 items-center justify-center">
            <div className="h-12 w-12 bg-emerald-900/20 rounded-full flex items-center justify-center hover:border-emerald-400 transition-all">
              <User2 className="h-8 w-8 text-emerald-400"/>
            </div>
           <div className="space-y-3 flex items-center justify-center flex-col">
             <CardTitle className="text-3xl">Join As Patient</CardTitle>
            <CardDescription>
              Book Appointments,Consult With Doctors,and get expert advice on
              your health.
            </CardDescription>
           </div>
            <Button disabled={isLoading} variant={"outline"} className="cursor-pointer" onClick={handlePatientSelection}>
              {isLoading ?<><Loader2 className="animate-spin h-4 w-4"/>processing...</>:<span>Continue as Patient</span>}
              
            </Button>
          </CardContent>
        </Card>
        <Card className="border-emerald-400/30 bg-emerald-900/10 hover:bg-emerald-900/20 transition-all">
          <CardContent className="flex flex-col gap-4 items-center justify-center">
            <div className="h-12 w-12 bg-emerald-900/20 rounded-full flex items-center justify-center hover:border-emerald-400 transition-all">
              <Stethoscope className="h-8 w-8 text-emerald-400"/>
            </div>
           <div className="space-y-3 flex items-center justify-center flex-col">
             <CardTitle className="text-3xl">Join As Doctor</CardTitle>
            <CardDescription>
              Create Your Professional Profile,Set Availability and start accepting appointments
            </CardDescription>
           </div>
            <Button disabled={isLoading} onClick={()=>setStep("doctor-form")} variant={"outline"} className="cursor-pointer">
              Continue as Doctor
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (step === "doctor-form") {
    return <DoctorForm setStep={setStep}/>
  }
};

export default page;
