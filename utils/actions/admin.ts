"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const verifyAdmin = async () => {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: new Error("Unauthorized") };
  }
  try {
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) {
      return { success: false, error: new Error("user not found") };
    }
    if (user.role !== "ADMIN") {
      return { success: false, error: new Error("Unauthorized") };
    }
    return { success: true, data: { admin: true } };
  } catch (error) {
    console.log("error in verifyadmin", error);
    return { success: false, error };
  }
};

export const getPendingDoctors = async () => {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: new Error("Unauthorized") };
  }
  try {
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) {
      return { success: false, error: new Error("user not found") };
    }
    if (user.role !== "ADMIN") {
      return { success: false, error: new Error("Unauthorized") };
    }
    const getPendingDoctors = await prisma.user.findMany({
      where: {
        role: "DOCTOR",
        verificationStatus: "PENDING",
      },
    });
    return { success: true, data: { pendingDoctors: getPendingDoctors } };
  } catch (error) {
    console.log("error in getting pending doctor", error);
    return { success: false, error };
  }
};

export const getVerifiedDoctors = async () => {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: new Error("Unauthorized") };
  }
  try {
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) {
      return { success: false, error: new Error("user not found") };
    }
    if (user.role !== "ADMIN") {
      return { success: false, error: new Error("Unauthorized") };
    }
    const getVerifiedDoctors = await prisma.user.findMany({
      where: {
        role: "DOCTOR",
        verificationStatus: "VERIFIED",
      },
    });
    return { success: true, data: { verifiedDoctors: getVerifiedDoctors } };
  } catch (error) {
    console.log("error in getting verified doctors", error);
    return { success: false, error };
  }
};

export const updateDoctorStatus = async (formData: FormData) => {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: new Error("Unauthorized") };
  }
  try {
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) {
      return { success: false, error: new Error("user not found") };
    }
    if (user.role !== "ADMIN") {
      return { success: false, error: new Error("Unauthorized") };
    }
    const doctorId = formData.get("doctorId");
    const status = formData.get("status");
    if (!doctorId || !status) {
      return {
        success: false,
        error: new Error("Invalid data all fields are required"),
      };
    }

    if (!["VERIFIED", "REJECTED"].includes(status.toString())) {
      return { success: false, error: new Error("invalid status") };
    }
    const updatedDoctor = await prisma.user.update({
      where: {
        id: doctorId.toString(),
      },
      data: {
        verificationStatus: status as VerificationStatus,
      },
    });
    revalidatePath("/admin");
    return { success: true, data: { updatedDoctor } };
  } catch (error) {
    console.log("error in updating user", error);
    return { success: false, error };
  }
};
export const suspendDoctor = async (formData: FormData) => {
  const { success } = await verifyAdmin();
  if (!success) {
    return { success: false, error: new Error("Unauthorized") };
  }
  try {
    const doctorId = formData.get("doctorId");
    const suspend = formData.get("suspend");
    if (!doctorId || !suspend) {
      return {
        success: false,
        error: new Error("Invalid data all fields are required"),
      };
    }

    if (!["SUSPEND"].includes(suspend.toString())) {
      return { success: false, error: new Error("invalid suspend data") };
    }
    const status = suspend ? "PENDING" : "VERIFIED";
    const updatedDoctor = await prisma.user.update({
      where: {
        id: doctorId.toString(),
      },
      data: {
        verificationStatus: status,
      },
    });
    revalidatePath("/admin");
    return { success: true, data: { updatedDoctor } };
  } catch (error) {}
};
type VerificationStatus = "VERIFIED" | "REJECTED";
