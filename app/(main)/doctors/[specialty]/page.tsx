
import { DoctorCard } from "@/components/common/DoctorCard";
import PageHeader from "@/components/common/PageHeader";
import { SPECIALTIES } from "@/lib/specialities";
import { getDoctorBySpecialty } from "@/utils/actions/doctor";

const page = async ({ params }: { params: Promise<{ specialty: string }> }) => {
  const specialty = (await params).specialty
    .split("%20")
    .join(" ")
    .replace("%26", "&");
  const icon = SPECIALTIES.find((s) => s.name == specialty);
  const { doctor: doctors, error } = await getDoctorBySpecialty(specialty);
  if (error) {
    console.log("error in getting doctor by specialty", error);
  }
  console.log("doctors", doctors);

  return (
    <div className="space-y-5">
      <PageHeader title={specialty} icon={icon?.icon} />
      {doctors?.length! > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {doctors?.map((doc,index)=>{
          return (<DoctorCard doctor={doc} key={doc.id}/>)
        })}

      </div> : <div>
            <p className="text-foreground/30 text-2xl">There Are Currently No Verified Doctors For The Specialty You Have Selected</p>
        </div>}


    </div>
  );
};

export default page;
