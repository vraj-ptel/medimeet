"use server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const onboardUser = async (formData:FormData) => {
  try {
    const { userId } = await auth();
    if (!userId) {
    //   throw new Error("Unauthorized");
    return {success:false,error:new Error("Unauthorized")}
    }
    const user=await prisma.user.findUnique({
        where:{clerkUserId:userId}
    })
    if(!user){
        return {success:false,error:new Error("user not found")}
    }
    const role=formData.get("role");
    if(!role || !["PATIENT","DOCTOR"].includes(role.toString())){
        return {success:false,error:new Error("Invalid role")}
    }

    if(role=="PATIENT"){
        await prisma.user.update({
            where:{
                id:user.id
            },data:{
                role:"PATIENT"
            }
        })
        revalidatePath('/')
        return {success:true,data:{redirect:"/doctors"}};
    }

    if(role=="DOCTOR"){
        const  specialty=formData.get("specialty");
        const experience=formData.get("experience");
        const credentialUrl=formData.get("credentialUrl");
        const description=formData.get("description");
        if(!specialty || !experience || !credentialUrl || !description){
            return {success:false,error:new Error("All fields are required")}
        }
        await prisma.user.update({
            where:{
                id:user.id
            },data:{
                role:"DOCTOR",
                specialty: specialty?.toString(),
                experience: Number(experience),
                credentialUrl: credentialUrl?.toString(),
                description: description?.toString(),
                verificationStatus:"PENDING"
            }
        })
        revalidatePath('/')
        return {success:true,data:{redirect:"/doctor/verification"}};
    }

  } catch (error) {
    console.log("error in onboarding", error);
    return {success:false,error}
  }
};

export const currentUser=async()=>{
    try {
     const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const user=await prisma.user.findUnique({
        where:{clerkUserId:userId}
    })
    if(!user){
        throw new Error("user not found");
    }
    return {success:true,user}
        
    } catch (error) {
        console.log("error in onboarding", error);
        throw error;
        
    }
}