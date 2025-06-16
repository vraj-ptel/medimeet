"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/useFetch";
import { bookAppointment, slot } from "@/utils/actions/appointment";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Clock, CreditCard, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Appointmentform = ({
  doctorId,
  slot,
  onComplete,
  onBack,
}: {
  doctorId: string;
  slot: slot;
  onComplete: () => void;
  onBack: () => void;
}) => {
  const [description, setDescription] = useState("");
  const { fn, data, error, isLoading } = useFetch(bookAppointment);
  useEffect(()=>{
    if(error){
      toast.error((error as unknown as Error).message);
      // console.log("error in request payment", error);
    }
  },[data,error])
  const handleSubmit=async(startTime:string,endTime:string,description:string)=>{
    if(!startTime || !endTime){
      toast.error("All fields are required");
      return
    }
    const formData=new FormData();
    formData.append("doctorId",doctorId);
    formData.append("startTime",startTime);
    formData.append("endTime",endTime);
    formData.append("description",description);
    console.log("formData",startTime,endTime);
    await fn(formData);
  }
  useEffect(()=>{
    if(data?.success && !isLoading){
      onComplete();
      toast.success(
        "Appointment booked successfully"      );
    }
  },[data])
  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="bg-muted/20 p-4 rounded-lg border border-emerald-900/20 space-y-3">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-emerald-400 mr-2" />
            <span className="text-white font-medium">
              {format(new Date(slot.startTime), "EEEE, MMMM d, yyyy")}
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-emerald-400 mr-2" />
            <span className="text-white">{slot.formatted}</span>
          </div>
          <div className="flex items-center">
            <CreditCard className="h-5 w-5 text-emerald-400 mr-2" />
            <span className="text-muted-foreground">
              Cost: <span className="text-white font-medium">2 credits</span>
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="description">
            Describe your medical concern (optional)
          </Label>
          <Textarea
            id="description"
            placeholder="Provide Any Additional Information About Your Medical Condition or Symptoms.."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          ></Textarea>
        </div>
        {/* buttons  */}
        <div className="flex justify-around flex-col md:flex-row gap-4 items-center">
          <div>
            <Button
              className="bg-emerald-400/50 hover:bg-emerald-400/45 cursor-pointer text-white"
              onClick={onBack}
              disabled={isLoading}
            >
                <ArrowLeft/>
              Change Time Slot
            </Button>
          </div>
          <div>
            <Button onClick={() => handleSubmit(new Date(slot.startTime).toISOString(),new Date(slot.endTime).toISOString(),description)}  disabled={isLoading} className="cursor-pointer" variant={"outline"}>
                {isLoading?<span><Loader2 className="h-4 w-4 animate-spin"/></span>:"Confirm Booking"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointmentform;
