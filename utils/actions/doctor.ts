"use server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { cancelAllAppointMentTimePassed } from "./patient";
//get doctor by specialty
export const getDoctorBySpecialty = async (specialty: string) => {
  try {
    const doctor = await prisma.user.findMany({
      where: {
        specialty: specialty,
      },
      orderBy: {
        name: "asc",
      },
    });
    return { doctor };
  } catch (error) {
    console.log("error in getting doctor by specialty", error);
    return { error };
    throw error;
  }
};

export const setAvailabilitySlot = async (formData: FormData) => {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: new Error("Unauthorized") };
  }
  try {
    const doctor = await prisma.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "DOCTOR",
      },
    });
    if (!doctor) {
      return { success: false, error: new Error("user not found") };
    }
    const startTime = formData.get("startTime");
    const endTime = formData.get("endTime");
    if (!startTime || !endTime) {
      return {
        success: false,
        error: new Error("Invalid data all fields are required"),
      };
    }
    if (startTime > endTime) {
      return {
        success: false,
        error: new Error("Start time should be less than end time"),
      };
    }

    const exisitingSlots = await prisma.availabiltiy.findMany({
      where: {
        doctorId: doctor.id,
      },
    });
    if (exisitingSlots.length > 0) {
      const slotsWithNoAppointments = exisitingSlots.filter(
        (slot) => !slot.status.includes("BOOKED")
      );
      if (slotsWithNoAppointments.length > 0) {
        await prisma.availabiltiy.deleteMany({
          where: {
            id: {
              in: slotsWithNoAppointments.map((slot) => slot.id),
            },
          },
        });
      }
    }

    // return {success:true,data:{availabilitySlot}}
    // Create new availability slot
    const newSlot = await prisma.availabiltiy.create({
      data: {
        doctorId: doctor.id,
        startTime: new Date(startTime as string),
        endTime: new Date(endTime as string),
        status: "AVAILABLE",
      },
    });

    revalidatePath("/doctor");
    return { success: true, data: { slot: newSlot } };
  } catch (error) {
    console.log("error in getting doctor by specialty", error);
    return { success: false, error };
  }
};
/**
 * Get doctor's current availability slots
 */
export async function getDoctorAvailability() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }
  try {
    const doctor = await prisma.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "DOCTOR",
      },
    });
    if (!doctor) {
      throw new Error("Doctor not found");
    }

    const availabilitySlots = await prisma.availabiltiy.findMany({
      where: {
        doctorId: doctor.id,
      },
      orderBy: {
        startTime: "asc",
      },
    });
    return { success: true, data: { slots: availabilitySlots } };
  } catch (error) {
    console.log("error in getting doctor by specialty", error);
    return { success: false, error };
  }
}

/**
 * Get doctor's upcoming appointments
 */

export async function getDoctorAppointments() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: new Error("Unauthorized") };
    }
    const doctor = await prisma.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "DOCTOR",
      },
    });
    if (!doctor) {
      throw new Error("Doctor not found");
    }
    // await cancelAllAppointMentTimePassed(doctor.id);
    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: doctor.id,
      },
      include: {
        patient: true,
        doctor: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });
    return { success: true, data: { appointments } };
  } catch (error) {
    console.log("error in getting doctor by specialty", error);
    return { success: false, error };
  }
}

export async function cancelAppointment(formData: FormData) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: new Error("Unauthorized") };
    }
    const user= await prisma.user.findUnique({
      where: {
        clerkUserId: userId,
      
      },
    });
    const appointMentId=formData.get("appointmentId");
    if(!appointMentId){
      return{success:false,error:new Error("Invalid data all fields are required")}
    }
    const appointment = await prisma.appointment.findUnique({
      where: {
        id: appointMentId as string,
      },
      include:{
        patient:true,
        doctor:true
      }
    });
    if (!appointment) {
      return { success: false, error: new Error("Appointment not found") };
    }
    if (appointment.doctorId !== user?.id && appointment.patientId !== user?.id) {
      return { success: false, error: new Error("Unauthorized to cancel this appointment") };
    }
    await prisma.$transaction(async(tx)=>{
      await tx.appointment.update({
        where:{
          id:appointment.id
        },data:{
          status:"CANCELLED"
        }
      })
      await tx.creditTransaction.create({
        data:{
          userId:appointment.patientId,
          amount:2,
          type:"APPOINTMENT_DEDUCTION"
        }
      })
      await tx.creditTransaction.create({
        data:{
          userId:appointment.doctorId,
          amount:-2,
          type:"APPOINTMENT_DEDUCTION"
        }
      })
      await tx.user.update({
        where:{
          id:appointment.patientId as string
        },data:{
          credit:{
            increment:2
          }
        }
      })
      await tx.user.update({
        where:{
          id:appointment.doctorId as string
        },data:{
          credit:{
            decrement:2
          }
        }
      })
    })

    if(user.role=="DOCTOR"){
      revalidatePath("/doctor")
    }else if(user.role=="PATIENT"){
      revalidatePath("/appointments")
    }
    return {success:true}
  
  } catch (error) {
    console.log("error in getting doctor by specialty", error);
    return { success: false, error };
  }
}

export async function addAppointmentsNotes(formData:FormData) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: new Error("Unauthorized") };
    }
    const doctor = await prisma.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "DOCTOR",
      },
    });
    if (!doctor) {
      throw new Error("Doctor not found");
    }
    const applicationId=formData.get("appointmentId");
    const notes=formData.get("notes");
    if(!applicationId||!notes){
      return{success:false,error:new Error("Invalid data all fields are required")}
    }
    const appointment=await prisma.appointment.findUnique({
      where:{
        id:applicationId as string
      }
    })
    if(!appointment){
      return{success:false,error:new Error("appointment not found cause invaild appointment id provided")}
    }
    const updatedAppointment=await prisma.appointment.update({
      where:{id:applicationId as string},
      data:{
        notes:notes as string
      }
    })
    revalidatePath('/doctor')
    return {success:true,data:{appointment:updatedAppointment}}
  } catch (error) {
    console.log("error in getting doctor by specialty", error);
    return { success: false, error };
  }
}

export async function markAppointmentDone(formData:FormData) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: new Error("Unauthorized") };
    }
    const doctor = await prisma.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "DOCTOR",
      },
    });
    if (!doctor) {
      throw new Error("Doctor not found");
    }
    const applicationId=formData.get("applicationId");
   
    if(!applicationId){
      return{success:false,error:new Error("Invalid data all fields are required")}
    }
    const appointment=await prisma.appointment.findUnique({
      where:{
        id:applicationId as string
      },include:{
        patient:true  
      }
    })
    if(!appointment){
      return{success:false,error:new Error("appointment not found cause invaild appointment id provided")}
    }
    if(appointment.status!=="SCHEDULED"){
      return{success:false,error:new Error("appointment is not scheduled yet")}
    }
    const now= new Date();
    const appointmentEndTime=new Date(appointment.endTime);
    if(now<appointmentEndTime){
      return {success:false,error:new Error("can not mark appointment as completed before the end time")}
    }
    const updatedAppointment=await prisma.appointment.update({
      where:{id:applicationId as string},
      data:{
        status:"COMPLETED"
      }
    })
    revalidatePath('/doctor')
    return {success:true,data:{appointment:updatedAppointment}}
  } catch (error) {
    console.log("error in getting doctor by specialty", error);
    return { success: false, error };
  }
}