import { Prisma } from "@/lib/generated/prisma";
import { auth } from "@clerk/nextjs/server";
import { addMinutes, getDate } from "date-fns";

export const getPatientAppointment=async()=>{
    const {userId}=await auth();
    if(!userId){
        return {success:false,error:new Error("unauthenticated")}
    }
    try {
        const patient=await prisma?.user.findUnique({where:{clerkUserId:userId,role:"PATIENT"}});
        if(!patient){
            return {success:false,error:new Error("patient not found")}
        }
        // await cancelAllAppointMentTimePassed(patient.id);
        const appointments=await prisma?.appointment.findMany({
            where:{
                patientId:patient.id
            },include:{
                patient:true,
                doctor:{
                    select:{
                        id:true,name:true,specialty:true,imageUrl:true,role:true
                    }
                }
            },
            orderBy:{
                startTime:"asc"
            }
        })
        // for(const appot of appointments!){
        //     if(appot){
        //         if(appot.endTime>new Date()){
        //         appot.status=""
        //         }
        //     }
        // }
        return {success:true,data:{appointments:appointments}}
    } catch (error) {
        console.log("error in geting patient appointments")
        return {success:false,error}
    }
}

export const cancelAllAppointMentTimePassed=async(userId:string)=>{
    try {
        const now=new Date()
        const updateAppointment=await prisma?.appointment.updateMany({
            where:{
                OR:[
                    {patientId:userId},
                    {doctorId:userId}
                ],
                status:"SCHEDULED",
                endTime:{
                    lte:addMinutes(now,60)
                }
            },
            data:{
                status:"CANCELLED"
            }
        })
    } catch (error) {
            console.log("error in canceling appointments",error);
            throw error;
    }   
}