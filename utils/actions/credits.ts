"use server"

import { CreditTransaction, User } from "@/lib/generated/prisma";
import { auth } from "@clerk/nextjs/server";
import {format} from "date-fns"
import { revalidatePath } from "next/cache";


interface UserWithTransaction extends User{
    transactions?:CreditTransaction[]
}
const planCredit={
    free_user:0,
    standard:10,
    premium:24
}
const eachAppointmentCost=2;

export const  checkAndAllocateCredits=async<T extends UserWithTransaction>(user:  T)=>{
    
    try {
        if(!user){
            return null;
        }
        if(user.role!=="PATIENT"){
            return user;
        }
        const {has}=await auth();
        const hasBasic=has({plan:"free_user"});
        const hasStandard=has({plan:"standard"});
        const hasPremium=has({plan:"premium"});
        

        let currentPlan=hasBasic?"free_user":hasStandard?"standard":"premium";
        let creditAllocate=hasBasic?planCredit.free_user:hasStandard?planCredit.standard:planCredit.premium;

        if(!currentPlan){
            return user;
        }

        const currentMonth=format(new Date(),"yyyy-MM");
      
        if(user.transactions){
            const lastTransaction=user.transactions[0]
            const transactionMonth=format(new Date(lastTransaction.createdAt),"yyyy-MM")
            const transactionPlan=lastTransaction.packageId
            //if we have last transaction and last transaction plan is same as current plan
           
            if(transactionMonth===currentMonth && transactionPlan===currentPlan){
                return user;
            }
        }
        const updatedUser=await prisma?.$transaction(async(tx)=>{
            await tx.creditTransaction.create({
                data:{
                    userId:user.id,
                    amount:creditAllocate,
                    type:"CREDIT_PURCHASE",
                    packageId:currentPlan
                }
            })
            await tx.user.update({
                where:{
                    id:user.id
                },
                data:{
                    credit:{
                        increment:creditAllocate
                    }
                }
            })
        })
        revalidatePath('/doctors')
        revalidatePath('/appointments')
        

        return updatedUser
        
    } catch (error) {
        console.log("error in checkAndAllocateCredits",error)
        throw error
    }
}   

export const deductCredit=async(patientId:string,doctorId:string)=>{
    try {
        const user=await prisma?.user.findUnique({
            where:{
                id:patientId,
                role:"PATIENT"
            }
        })
       
         const doctor=await prisma?.user.findUnique({
            where:{
                id:doctorId,
                role:"DOCTOR"
            }
        })
        
        if(!user || !doctor){
            return {success:false,error:new Error("no found doctor or user")}
        }
        if(user.credit <eachAppointmentCost ){
            return {success:false,error:new Error("Insufficient credit")}
        }
        const updatedUser=await prisma?.$transaction(async(tx)=>{
            await tx.creditTransaction.create({
                data:{
                    userId:user.id,
                    amount:-eachAppointmentCost,
                    type:"APPOINTMENT_DEDUCTION",
                    
                }
            })
            await tx.creditTransaction.create({
                data:{
                    userId:doctor.id,
                    amount:eachAppointmentCost,
                    type:"APPOINTMENT_DEDUCTION",
                    
                }
            })
           const updatedUser= await tx.user.update({
                where:{
                    id:patientId
                },
                data:{
                    credit:{
                        decrement:eachAppointmentCost
                    }
                }
            })
            await tx.user.update({
                where:{
                    id:doctorId
                },
                data:{
                    credit:{
                        increment:eachAppointmentCost
                    }
                }
            })
            return updatedUser
            
        })
        revalidatePath('/doctors')
        revalidatePath('/appointments')
        return {success:true,data:{updatedUser}}
    } catch (error) {
        console.log("error in checkAndAllocateCredits",error)
        return {success:false,error}
    }
}