import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentUser } from "@/utils/actions/checkuser";
import { AlertCircle, ClipboardCheck, XCircle } from "lucide-react";
import { redirect } from "next/navigation";

import React from "react";
export const metadata = {
  title: "Verification",
  description: "complete your profile to get started with medimeet",
};

const page = async () => {
  const user = await getCurrentUser();
  if (user?.data?.user.verificationStatus === "VERIFIED") {
    redirect("/doctor");
  }
  const isRejected = user?.data?.user.verificationStatus === "REJECTED";

  return (
    <div className="container mx-auto ">
      <div className="max-w-2xl mx-auto">
        <Card className="border-emberald-900/20">
          <CardHeader>
            <div
              className={`mx-auto ${
                isRejected ? "bg-red-900/20" : "bg-amber-900/20"
              } rounded-full mb-4 w-fit p-4`}
            >
              {isRejected ? (
                <>
                  <XCircle className="h-8 w-8 text-red-400" />
                </>
              ) : (
                <>
                  <ClipboardCheck className="h-8 w-8 text-amber-400" />
                </>
              )}
            </div>
            <CardTitle className="text-3xl  text-center ">
              {isRejected ? "Verification Rejected" : "Verification Pending"}
            </CardTitle>
            <CardDescription className="mx-auto">
              {isRejected
                ? "Your verification request has been rejected"
                : "Your verification request is pending"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {
              isRejected?<div className="bg-red-900/15 rounded-2xl p-4">
                <AlertCircle className="h-5 mr-3  flex-shrink-0 w-5 text-red-400"/>
                <div className="text-muted-foreground/30 text-left">
                  <p>
                    Unfortunately, your verification request was not approved.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 mb-3">
                    <li>The documents provided were unclear or incomplete.</li>
                    <li>Some required information was missing.</li>
                    <li>The submitted details did not match official records.</li>
                  </ul>
                  <p>
                    You Can Update Your Application With More Details And Submit Again For Verification
                  </p>
                </div>
              </div>:<div className="bg-amber-900/15 rounded-2xl p-4">
                <AlertCircle className="h-5 mr-3  flex-shrink-0 w-5 text-amber-400"/>
                <div className="text-muted-foreground/30 text-left">
                   <ul className="list-disc pl-5 space-y-1 mb-3">
                    <li>Your verification request is currently under review.</li>
                    <li>Our team is reviewing your submitted documents and information. This process may take little time</li>
                   
                  </ul>
                </div>
              </div>
            }
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
