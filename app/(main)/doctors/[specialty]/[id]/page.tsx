import {
  getAvailableTimeSlot,
  getDoctorById,
} from "@/utils/actions/appointment";
import { redirect } from "next/navigation";
import React from "react";
import DoctProfile from "./_components/DoctProfile";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  try {
    const [doctorData, slotsData] = await Promise.all([
      getDoctorById(id),
      getAvailableTimeSlot(id),
    ]);
    // console.log("doctorData", doctorData);
    // console.log("slotsData", slotsData.data);
    if (doctorData.doctor) {
      return (
        <div>
          <DoctProfile
            doctor={doctorData.doctor}
            availableDays={slotsData.data?.days || []}
          />
        </div>
      );
    }
  } catch (error) {
    console.error("error loading doctor profile", error);
    redirect("/doctors");
  }
};

export default page;
