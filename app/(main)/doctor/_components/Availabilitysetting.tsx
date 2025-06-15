"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import useFetch from "@/hooks/useFetch";
import { Availabiltiy } from "@/lib/generated/prisma";
import { setAvailabilitySlot } from "@/utils/actions/doctor";
import { format } from "date-fns";
import { Clock, Info, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PropagateLoader } from "react-spinners";
import { toast } from "sonner";

const Availabilitysetting = ({ slots }: { slots: Availabiltiy[] }) => {
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    defaultValues: {
      startTime: "",
      endTime: "",
    },
  });
  const createLocalDateFormTime = (timestr: string) => {
    const [hours, minutes] = timestr.split(":").map(Number);
    const date = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      hours,
      minutes
    );
    return date;
  };
  const { fn, error, isLoading, data } = useFetch(setAvailabilitySlot);
  const handleSetAvailability = async (Data: {
    startTime: string;
    endTime: string;
  }) => {
    console.log("formData", Data);
    const formData = new FormData();
    if (
      createLocalDateFormTime(Data.startTime).toISOString() >
      createLocalDateFormTime(Data.endTime).toISOString()
    ) {
      toast.error("Start time should be less than end time");
    }
    formData.append(
      "startTime",
      createLocalDateFormTime(Data.startTime).toISOString()
    );
    formData.append(
      "endTime",
      createLocalDateFormTime(Data.endTime).toISOString()
    );
    await fn(formData);
  };
  useEffect(() => {
    if (data && !isLoading && data.success) {
      toast.success("Availability set successfully");
      setShowForm(false);
      reset({ startTime: "", endTime: "" });
    }
  }, [data]);
  return (
    <div>
      <Card className="border-emerald-400/30 bg-emerald-900/20">
        <CardHeader>
          <CardTitle className="flex gap-4">
            <Clock className="h-5 w-5 text-emerald-400" />
            Availability Settings
          </CardTitle>
          <CardDescription>
            set your availability for patient appointments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Separator className="text-emerald-400" />
          {!showForm ? (
            <div className="flex w-full flex-col gap-4 items-center justify-center">
              <h3 className="capitalize text-center  text-muted-foreground">
                current availabilities
              </h3>
              {slots.length > 0 ? (
                <div>
                  {slots.map((slot:Availabiltiy)=>{
                    return <div key={slot.id} className="flex flex-row items-center">
                        <div className=" bg-emerald-900/20 rounded-full mr-3">
                          <Clock className="h-4 w-4 text-emerald-400"/>
                        </div>
                        <div>
                          <p>{format(slot.startTime, "hh:mm a")}-{format(slot.endTime, "hh:mm a")}</p>
                        </div>
                    </div>
                  })}
                </div>
              ) : (
                <div className=" text-foreground/30 md:flex md:flex-row md:items-center">
                  
                    <Info className="h-4 w-4"/>
                    you haven't set any availabilities yet.set your
                    availabilities to start accepting appointments
                  
                </div>
              )}
              <Button
                variant={"outline"}
                className="md:w-md w-full "
                onClick={() => setShowForm(true)}
              >
                <Plus className="h-4 w-4" />
                Set Availability Time
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <form
                onSubmit={handleSubmit(handleSetAvailability)}
                className="space-y-4 border border-emerald-900/20 rounded-md p-4 w-full md:w-md"
              >
                <h3 className="capitalize text-center  text-muted-foreground">
                  set your daily availability
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="starttime" /> Start Time
                    <Input
                      type="time"
                      id="starttime"
                      {...register("startTime", {
                        required: "start time is required",
                      })}
                    />
                    {errors.startTime && (
                      <p className="text-red-500/60 text-sm">
                        {errors.startTime.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="endtime" /> End Time
                    <Input
                      type="time"
                      id="endtime"
                      {...register("endTime", {
                        required: "end time is required",
                      })}
                    />
                    {errors.startTime && (
                      <p className="text-red-500/60 text-sm">
                        {errors.startTime.message}
                      </p>
                    )}
                  </div>
                  <div className=" flex flex-row gap-2">
                    <Button
                      disabled={isLoading}
                      className="bg-red-400 text-white hover:bg-red-400/80 cursor-pointer"
                      onClick={() => setShowForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled={isLoading}
                      variant={"outline"}
                      className="cursor-pointer"
                      type="submit"
                    >
                      Set Your Availability
                    </Button>
                  </div>
                  <div className="w-full flex items-center justify-center">
                    <PropagateLoader color="#22c55e" loading={isLoading} />
                  </div>
                </div>
              </form>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Availabilitysetting;
