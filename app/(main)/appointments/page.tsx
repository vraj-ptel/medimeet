import Appointmentcard from "@/components/common/Appointmentcard";
import PageHeader from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/utils/actions/checkuser";
import { getPatientAppointment } from "@/utils/actions/patient";
import { Calendar } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.data?.user.role !== "PATIENT") {
    redirect("/onboarding");
  }
  const { data, error } = await getPatientAppointment();
  if (error) {
    console.error((error as Error)?.message || error);
  }
  console.log("data", data?.appointments?.length);
  return (
    <div className="container mx-auto px-10 py-20 ">
      <PageHeader
        icon={<Calendar />}
        title="My Appointments"
        backLink="/doctors"
        backLabel="find doctors"
      ></PageHeader>
      <Card className="bg-emerald-900/20 border-emerald-400/30">
        <CardContent>
          {error ? (
            <div>
              <p className="text-red-500">Error:{(error as Error)?.message}</p>
            </div>
          ) : (
            <div>
              {data?.appointments?.length == 0 ? (
                <div>
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <h3 className="text-xl font-medium text-white mb-2">
                      No appointments scheduled
                    </h3>
                    <p className="text-muted-foreground">
                      You don&apos;t have any appointments scheduled yet. Browse
                      our doctors and book your first consultation.
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="space-y-4">
                    {data?.appointments?.map((appointment) => (
                      <Appointmentcard
                        key={appointment.id}
                        appointment={appointment}
                        userRole="PATIENT"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
