import { PrismaClient } from "./generated/prisma";

// const prisma =globalThis.prisma || new PrismaClient();
const prisma=new PrismaClient()
// if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
export default prisma;


