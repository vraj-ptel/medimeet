"use server"
import { Appointment } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { endOfDay } from "date-fns";
import { revalidatePath } from "next/cache";

const CREDIT_VALUE = 10; // $10 per credit total
const PLATFORM_FEE_PER_CREDIT = 2; // $2 platform fee
const DOCTOR_EARNINGS_PER_CREDIT = 8; // $8 to doctor


export const getDoctorIncomeDetails = async (doctorId: string) => {
  if (!doctorId) {
    return { success: false, error: new Error("doctor id is required") };
  }
  try {


    const doctor=await prisma.user.findUnique({
        where:{
            id:doctorId,
            role:"DOCTOR"
        }
    })
    if(!doctor){
        return { success: false, error: new Error("doctor not found") };
    }
    const currentDate=new Date();
    currentDate.setDate(1);
    currentDate.setHours(0,0,0,0);


    const appointments=await prisma.appointment.findMany({
        where:{
            doctorId,
            status:"COMPLETED"
        }
    })
    const thisMonthAppointMents=appointments.filter((appointment:Appointment)=>new Date(appointment.createdAt)>=currentDate);

    const displayTotalEaring=appointments.length*2*CREDIT_VALUE


    const totalEarning=doctor.credit*CREDIT_VALUE
    const thisMonthEarning=thisMonthAppointMents.length*2*CREDIT_VALUE;
    const totalPayOutEarning=doctor.credit*DOCTOR_EARNINGS_PER_CREDIT;
    const totalCredits=doctor.credit;
    const totalAppointments=appointments.length;
    const totalPlatformFee=doctor.credit*PLATFORM_FEE_PER_CREDIT
    const avgWeeklyEarningInThisMonth=thisMonthEarning>0 ?thisMonthEarning/4:0

    return {success:true,data:{
        totalEarning,
        displayTotalEaring,
        thisMonthEarning,
        totalPayOutEarning,
        totalCredits,
        totalAppointments,
        totalPlatformFee,
        avgWeeklyEarningInThisMonth
    }}

  } catch (error) {
    console.log("error in getting doctor by id", error);
    return { success: false, error };
  }
};

export const generatePayout=async(formData:FormData)=>{
    const {userId}=await auth();
    if(!userId){
        return {success:false,error:new Error("unauthenticated")}
    }
    try {
        const doc=await prisma.user.findUnique({where:{clerkUserId:userId,role:"DOCTOR"}});
        if(!doc){
            return {success:false,error:new Error("doctor not found")}
        }
        const payOut=await prisma.payout.findFirst({where:{doctorId:doc.id,status:"PROCESSING"}});
        if(payOut){
            return {success:false,error:new Error("You Can Request Only After Present Pay Out Is Completed")}
        }
        const amount=formData.get("totalAmount");
        const credits=formData.get("totalCredits");
        const platFormFee=formData.get("platFormFee");
        const netAmount=formData.get("netAmount");
        const payPalEmail=formData.get("paypalEmail");

        if(!amount||!credits||!platFormFee||!netAmount||!payPalEmail){
            return {success:false,error:new Error("all fields are required")}

        }

        const generatedPayOut=await prisma.payout.create({
            data:{
                doctorId:doc.id,
                status:"PROCESSING",
                amount:+amount ,
                credits:+credits,
                platformFee:+platFormFee,
                netAmount:+netAmount,
                paypalEmail:payPalEmail as string
            }
        })
        await prisma.$transaction(async(tx:any)=>{
            await tx.creditTransaction.create({
                data:{
                    amount:-credits,
                    type:"APPOINTMENT_DEDUCTION",
                    userId:doc.id
                }
            })
            await tx.user.update({
                where:{id:doc.id},
                data:{credit:{decrement:+credits}}
            })
        })
        revalidatePath('/doctor')
        return {success:true,data:generatedPayOut}
    } catch (error) {
        console.log("error in generating payout", error);
        return {success:false,error}
    }
}


export const getAllPayouts=async()=>{
     const {userId}=await auth();
    if(!userId){
        return {success:false,error:new Error("unauthenticated")}
    }
    try {
        const admin=await prisma.user.findUnique({where:{clerkUserId:userId,role:"ADMIN"}});
        if(!admin){
            return {success:false,error:new Error("admin not found")}
        }
        const allPayOuts=await prisma.payout.findMany({
            where:{
                status:"PROCESSING"
            },
            include:{
                doctor:true
            },
            orderBy:{
                createAt:"desc"
            }
        })

        return {success:true,data:{allPayOuts}}
        
    } catch (error) {
        console.log("error getting all payouts",error);
        return {success:false,error}
    }
}

export const approvePayout=async(payoutId:string)=>{
    const {userId}=await auth();
    if(!userId){
        return {success:false,error:new Error("unauthenticated")}
    }
    try {
        const admin=await prisma.user.findUnique({where:{clerkUserId:userId,role:"ADMIN"}});
        if(!admin){
            return {success:false,error:new Error("admin not found")}
        }
        const approvedPayOut=await prisma.payout.update({
            where:{id:payoutId},
            data:{status:"PROCESSED"}
        })
        revalidatePath("/doctor")
        revalidatePath("/admin")
        return {success:true,data:approvedPayOut}
    } catch (error) {
        console.log("error in approving payout",error);
        return {success:false,error}
    }
}

 export const  getCompletedPayout=async()=>{
    const {userId}=await auth();
    if(!userId){
        return {success:false,error:new Error("unauthenticated")}
    }
    try {
        const user=await prisma.user.findUnique({where:{clerkUserId:userId}});
        if(!user){
            return {success:false,error:new Error(" user not found")}
        }
        const completedPayOut=await prisma.payout.findMany({
           
           where:{
            doctorId:user.id
           }
        })
        return {success:true,data:{completedPayOut}}
    } catch (error) {
        console.log("error in getting completed payout",error);
        return {success:false,error}
    }
}