import PageHeader from "@/components/common/PageHeader";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { verifyAdmin } from "@/utils/actions/admin";
import { AlertCircle, DollarSign, ShieldCheck, User2 } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
export const metadata = {
  title: "Admin Dashboard",
};

const layout = async ({ children }: { children: React.ReactNode }) => {
  const isAdmin = await verifyAdmin();
  if (!isAdmin.success) {
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
          <TabsList className="flex gap-2  md:flex-col h-fit p-2 w-full bg-emerald-900/10 border-emerald-400/30">
            <TabsTrigger
              className="md:w-full"
              value="pending"
            >
              <AlertCircle className=" hidden md:block mr-2 h-4 w-4"></AlertCircle>
              <span>Pending Verification</span>
            </TabsTrigger>
            <TabsTrigger
              className="md:w-full"
              value="doctors"
            >
              <User2 className=" hidden md:block mr-2 h-4 w-4"></User2> <span>Doctors</span>
            </TabsTrigger>
            <TabsTrigger
              className="md:w-full"
              value="payout"
            >
              <DollarSign className="hidden md:block mr-2 h-4 w-4"></DollarSign>{" "}
              <span>Payouts</span>
            </TabsTrigger>
          </TabsList>

          {children}
        </Tabs>
      </div>
    </div>
  );
};

export default layout;
