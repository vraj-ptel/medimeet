"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User as UserType } from "@/lib/generated/prisma";
import { Separator } from "@radix-ui/react-separator";
import {
  AlertCircle,
  Calendar,
  ChevronDown,
  ChevronUp,
  FileText,
  Medal,
  User,
} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import SlotPicker from "./SlotPicker";
import Appointmentform from "./Appointmentform";
import { useRouter } from "next/navigation";

const DoctProfile = ({
  doctor,
  availableDays,
}: {
  doctor: UserType;
  availableDays: any[];
}) => {
  const [showBooking, setShowBooking] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const router=useRouter()

  const handleSlotSelect = (slot: any) => {
    setSelectedSlot(slot);
  };
  
   const totalSlots = availableDays?.reduce(
    (total, day) => total + day.slots.length,
    0
  );
  const toggleBooking = () => {
    setShowBooking((prev) => !prev);
    if (!showBooking) {
      setTimeout(() => {
        document
          .getElementById("booking-section")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };
  const handleBookingComplete=()=>{
    router.push('/appointments')
  }
  console.log("kd", totalSlots);
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
      {/* left ui  */}
      <div className="col-span-1 mx-auto md:ml-0 ml-2 w-[100%]">
        <div className="md:sticky w-full  md:top-24 ">
          <Card className="w-full">
            <CardContent>
              <div className="flex flex-col w-full gap-4 items-center text-center">
                <div className="w-32 h-32 relative rounded-full bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                  {doctor.imageUrl ? (
                    <Image
                      src={doctor.imageUrl}
                      alt={doctor.name}
                      className=" object-cover rounded-full"
                      // width={100}
                      // height={100}
                      fill
                    />
                  ) : (
                    <User className="h-20 w-20 text-emerald-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-white text-lg">
                    Dr. {doctor.name}
                  </h3>
                </div>
                <div className="text-muted-foreground/90">
                  is a <span className="text-emerald-400">verified</span> doctor
                  with specialty in {doctor.specialty}
                </div>

                <div className="text-sm text-muted-foreground mb-1 flex flex-row items-center justify-center">
                  <span>
                    <Medal className="text-emerald-400" />
                  </span>
                  <p>
                    {doctor.specialty} • {doctor.experience} years of experience
                  </p>
                </div>
                <Button
                  variant={"outline"}
                  onClick={() => toggleBooking()}
                  className="w-full cursor-pointer transition-all"
                >
                  {showBooking ? (
                    <>
                      Hide Booking
                      <ChevronDown className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Book Appointment
                      <ChevronUp className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* right ui  */}
      <div className="col-span-2 space-y-6">
        <Card className="bg-emerald-900/20 border-emerald-400/30">
          <CardHeader>
            <CardTitle>About Dr. {doctor.name}</CardTitle>
            <CardDescription className="capitalize">
              professional background and expertise
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-emerald-400" />
                <h3 className="font-medium text-white">Description</h3>
              </div>
              <p className="text-muted-foreground whitespace-pre-line">
                {doctor.description}
              </p>
            </div>
            <Separator className="text-emerald-400" />
            {totalSlots > 0 ? (
              <div className="flex items-center">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-emerald-400 mr-2" />
                  <p className="text-muted-foreground">
                    {totalSlots} time slots available for booking over the next
                    4 days
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-5">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No available slots for the next 4 days. Please check back
                    later.
                  </AlertDescription>
                </Alert>
              </div>
            )}
            {showBooking && (
              <div id="booking-section">
                <Card className="border-emerald-400/30 bg-emerald-900/30 my-5">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-white">
                      Book an Appointment
                    </CardTitle>
                    <CardDescription>
                      Select a time slot and provide details for your
                      consultation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {totalSlots > 0 ? (
                      <div>

                        {!selectedSlot&&<SlotPicker days={availableDays} onSelectedSlot={handleSlotSelect}/>}
                        {selectedSlot&&<Appointmentform doctorId={doctor.id} slot={selectedSlot} onComplete={handleBookingComplete} onBack={()=>{setSelectedSlot(null)}} />}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                        <h3 className="text-xl font-medium text-white mb-2">
                          No available slots
                        </h3>
                        <p className="text-muted-foreground">
                          This doctor doesn&apos;t have any available
                          appointment slots for the next 4 days. Please check
                          back later or try another doctor.
                        </p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter></CardFooter>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctProfile;
