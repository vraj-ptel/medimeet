import PageHeader from "@/components/common/PageHeader";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { verifyAdmin } from "@/utils/actions/admin";
import { AlertCircle, ShieldCheck, User2 } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
export const metadata = {
  title: "Admin Dashboard",
};

const layout = async ({ children }: { children: React.ReactNode }) => {
  const isAdmin = await verifyAdmin();
  if(!isAdmin.success){
    redirect("/onboarding");
  }
  return (
    <div className="py-20 px-10 container mx-auto">
      <PageHeader title="Admin Dashboard" icon={<ShieldCheck />}></PageHeader>
      <div>
        <Tabs
          defaultValue="pending"
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <TabsList className="md:col-span-1  bg-muted/30 h-14 md:h-28 flex sm:flex-row md:flex-col w-full p-2 md:p-5 rounded-md md:space-y-3 sm:space-x-2 md:space-x-0">
            <TabsTrigger className="transition-all w-full ease-in-out flex-1 md:flex md:items-center md:justify-center md:px-4 md:py-3" value="pending">
              <AlertCircle className="mr-2 h-4 w-4"></AlertCircle>
              <span>Pending Verification</span>
            </TabsTrigger>
            <TabsTrigger className="transition-all w-full ease-in-out flex-1 md:flex md:items-center md:justify-center md:px-4 md:py-3" value="doctors">
              <User2 className="mr-2 h-4 w-4"></User2> <span>Doctors</span>
            </TabsTrigger>
          </TabsList>

          {children}
        </Tabs>
      </div>
    </div>
  );
};

export default layout;
