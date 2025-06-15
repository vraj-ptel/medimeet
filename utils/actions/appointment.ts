"use server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { addDays, addMinutes, endOfDay, format, isBefore } from "date-fns";
import { deductCredit } from "./credits";
import { revalidatePath } from "next/cache";
import { Auth } from "@vonage/auth";
import { Vonage } from "@vonage/server-sdk";

const credential = new Auth({
  applicationId: process.env.NEXT_PUBLIC_VONAGE_APPLICATION_ID,
  privateKey: process.env.VONGAE_PRIVATE_KEY,
});
const vonage = new Vonage(credential, {});
const getDoctorById = async (doctorId: string) => {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: new Error("Unauthorized") };
  }
  try {
    const doctor = await prisma.user.findUnique({
      where: { id: doctorId, role: "DOCTOR" },
    });
    if (!doctor) {
      throw new Error("doctor not found");
    }
    return { doctor };
  } catch (error) {
    console.log("error in getting doctor by id", error);
    throw error;
  }
};

const getAvailableTimeSlot = async (doctorId: string) => {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: new Error("Unauthorized") };
  }
  try {
    const doctor = await prisma.user.findUnique({
      where: { id: doctorId, role: "DOCTOR", verificationStatus: "VERIFIED" },
    });
    if (!doctor) {
      return { success: false, error: new Error("doctor not found") };
    }
    const availability = await prisma.availabiltiy.findFirst({
      where: {
        doctorId: doctor.id,
        status: "AVAILABLE",
      },
    });

    if (!availability) {
      return { success: false, error: new Error("doctor is not available") };
    }

    const now = new Date();
    const days = [now, addDays(now, 1), addDays(now, 2), addDays(now, 3)];
    const lastDay = endOfDay(days[3]);
    const existingAppointment = await prisma.appointment.findMany({
      where: {
        doctorId,
        status: "SCHEDULED",
        startTime: { lte: lastDay },
      },
    });
    console.log("existingAppointment", existingAppointment);
    const availableSlotByDay: any = {};
    for (const day of days) {
      const dateString = format(day, "yyyy-MM-dd");
      availableSlotByDay[dateString] = [];

      const availabilityStartTime = new Date(availability.startTime);
      const availabilityEndTime = new Date(availability.endTime);

      //set the day we are processing
      availabilityStartTime.setFullYear(
        day.getFullYear(),
        day.getMonth(),
        day.getDate()
      );

      availabilityEndTime.setFullYear(
        day.getFullYear(),
        day.getMonth(),
        day.getDate()
      );

      let current = new Date(availabilityStartTime);
      const end = new Date(availabilityEndTime);

      while (
        isBefore(addMinutes(current, 30), end) ||
        +addMinutes(current, 30) === +end
      ) {
        const next = addMinutes(current, 30);
        if (isBefore(current, now)) {
          current = next;
          continue;
        }
        const overlap = existingAppointment.some((appoint) => {
          const aStart = appoint.startTime;
          const aEnd = appoint.endTime;
          return (
            (current >= aStart && current < aEnd) ||
            (next > aStart && next <= aEnd) ||
            (current <= aStart && next >= aEnd)
          );
        });
        if (!overlap) {
          availableSlotByDay[dateString].push({
            startTime: current.toISOString(),
            endTime: next.toISOString(),
            formatted: `${format(current, "h:mm a")} - ${format(
              next,
              "h:mm a"
            )}`,
            day: format(current, "EEEE,MMMM d"),
          });
        }

        current = next;
      }
    }
    const result = Object.entries(availableSlotByDay).map(([date, slots]) => {
      const slotArray = slots as Array<any>;
      return {
        date,
        displayDate:
          slotArray.length > 0
            ? slotArray[0].day
            : format(new Date(date), "EEEE,MMMM d"),
        slots: slotArray,
      };
    });

    return { success: true, data: { days: result } };
  } catch (error) {
    console.log("error in getting doctor by id", error);
    return { success: false, error };
  }
};
export type slot = {
  startTime: string;
  endTime: string;
  formatted: string;
  day: string;
};
export interface AvailableTimeSloat {
  date: string;
  displayDate: string;
  slots: Array<slot>;
}

async function bookAppointment(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: new Error("Unauthorized") };
  }
  try {
    const patient = await prisma.user.findUnique({
      where: { clerkUserId: userId, role: "PATIENT" },
    });
    if (!patient) {
      return { success: false, error: new Error("patient not found") };
    }
    //parse form data
    const doctorId = formData.get("doctorId");
    const startTime = formData.get("startTime");
    const endTime = formData.get("endTime");
    const patientDescription = formData.get("description");
    if (!doctorId || !startTime || !endTime) {
      return {
        success: false,
        error: new Error("Invalid data all fields are required"),
      };
    }
    const doctor = await prisma.user.findUnique({
      where: {
        id: doctorId as string,
        role: "DOCTOR",
        verificationStatus: "VERIFIED",
      },
    });
    if (!doctor) {
      return { success: false, error: new Error("doctor not found") };
    }
    if (patient.credit < 2) {
      return { success: false, error: new Error("Insufficient credit") };
    }
    const overlappingAppointMent = await prisma.appointment.findFirst({
      where: {
        doctorId: doctor.id,
        status: "SCHEDULED",
        OR: [
          {
            startTime: { lte: startTime as string },
            endTime: { gt: startTime as string },
          },
          {
            endTime: { gte: endTime as string },
            startTime: { lt: endTime as string },
          },
          {
            startTime: { gte: startTime as string },
            endTime: { lte: endTime as string },
          },
        ],
      },
    });
    if (overlappingAppointMent) {
      return { success: false, error: new Error("Overlapping appointment") };
    }
    const sessionId = await createVideoSession();

    const { success, error } = await deductCredit(patient.id, doctor.id);
    if (!success) {
      // console.log("dddddddddddddddddddd",error);
      throw new Error("error in deducting credit");
    }
    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: doctor.id,
        startTime: startTime as string,
        endTime: endTime as string,
        patientDescription: patientDescription as string,
        videoSessionId: sessionId,
        status: "SCHEDULED",
      },
    });

    revalidatePath("/appointments");
    return { success: true, data: { appointment } };
  } catch (error) {
    console.log("error in booking appointment", error);
    return { success: false, error };
  }
}
const createVideoSession = async () => {
  try {
    const session = await vonage.video.createSession({
      // @ts-expect-error: Ignore TS error for mediaMode property
      mediaMode: "routed",
    });
    return session.sessionId;
  } catch (error) {
    console.log("error in creating video session", error);
    throw error;
  }
};

//generte a video token for video call
async function generateVideoToken(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: new Error("Unauthorized") };
  }
  try {
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId, role: "PATIENT" },
    });
    if (!user) {
      return { success: false, error: new Error("patient not found") };
    }
    const appointmentId = formData.get("appointmentId");
    if (!appointmentId) {
      return { success: false, error: new Error("Invalid data all fields are required") };
    }
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId as string },
    });
    if (!appointment) {
      return { success: false, error: new Error("appointment not found") };
    }
    if(appointment.doctorId !== user.id && appointment.patientId !== user.id){
      return { success: false, error: new Error("you are not authorized to join this video call") };
    }
    if(appointment.status!=="SCHEDULED"){
      return { success: false, error: new Error("appointment is not scheduled") };

    }
  
    const now=new Date();
    const aStartTime=new Date(appointment.startTime);
    const timeDiff=(+aStartTime-+now)/(1000*60);
    if(timeDiff>30){
      return { success: false, error: new Error("this call will be available 30 minutes before the start time") };
    }
    const aEndTime=new Date(appointment.endTime);
    // 1 hour after end time of appointment
    const expirationTime=Math.floor(aEndTime.getTime()/1000)+60*60;
    const connectionData=JSON.stringify({
      name:user.name,
      role:user.role,
      userId:user.id
    })
    if(!appointment.videoSessionId){
      return { success: false, error: new Error("video session not found") };
    }
   const token= vonage.video.generateClientToken(appointment.videoSessionId,{role:"publisher",expireTime:expirationTime,data:connectionData})
   await prisma.appointment.update({
    where:{id:appointmentId as string},
    data:{
      videoSessionToken:token
    }
   })
    return { success: true, data: {videoSessionId:appointment.videoSessionId,videoSessionToken:token  } };
  } catch (error) {
    console.log("error in generating video token", error);
    return { success: false, error };
  }
}
export {
  getDoctorById,
  getAvailableTimeSlot,
  bookAppointment,
  generateVideoToken,
};
