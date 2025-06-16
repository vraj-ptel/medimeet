
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
export const getCurrentUser = async () => {
  const user = await currentUser();
  if (!user) {
    return null;
  }
  try {
    const dbUser = await prisma.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
      include: {
        transactions: {
          where: {
            type: "CREDIT_PURCHASE",
            createdAt: {
              gte: new Date(
                new Date().getFullYear(),
                new Date().getMonth() - 1,
                1
              ),
              
            },
          },
          orderBy:{
            createdAt:"desc"
          }
        },
      },
    });
    if (dbUser) {
      return { success: true, data:{user: dbUser} };
    }
    const newUserCreated = await prisma.user.create({
      data: {
        clerkUserId: user.id,
        email: user.emailAddresses[0].emailAddress,
        imageUrl: user.imageUrl,
        name: `${user.firstName} ${user.lastName}`,
        transactions: {
          create: {
            type: "CREDIT_PURCHASE",
            packageId: "free_user",
            amount: 2,
          },
        },
      },
    });
    return { success: true, data:{user: newUserCreated} };
  } catch (error) {
    console.log("error", error);
    return { success: false, error };
  }
};
