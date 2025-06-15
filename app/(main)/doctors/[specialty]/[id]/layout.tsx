import PageHeader from "@/components/common/PageHeader";
import { getDoctorById } from "@/utils/actions/appointment";
import { redirect } from "next/navigation";
import React from "react";
import { BriefcaseMedical } from "lucide-react";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = (await params).id;
  const doctor = await getDoctorById(id);
  return {
    title: `Dr ${doctor.doctor?.name} - Medimeet`,
    description: `Dr ${doctor.doctor?.name} with specialty of ${doctor.doctor?.specialty}`,
  };
};
const layout = async ({ params ,children}: { params: Promise<{ id: string }> ,children:React.ReactNode}) => {
  const id = (await params).id;
  const doctor = await getDoctorById(id);
  if (!doctor) {
    redirect("/doctors");
  }
  if (doctor.error) {
    throw doctor.error;
    redirect("/doctors");
  }

  return (
    <div >
      <PageHeader
        title={`Dr ${doctor.doctor?.name}`}
        backLabel={`Back To ${doctor.doctor?.specialty}`}
        backLink={`/doctors/${doctor.doctor?.specialty}`}
        icon={<BriefcaseMedical />}
      />
      {children}
    </div>
  );
};

export default layout;
