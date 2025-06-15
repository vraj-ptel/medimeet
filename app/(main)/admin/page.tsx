
import { getPendingDoctors, getVerifiedDoctors } from "@/utils/actions/admin";
import { TabsContent } from "@radix-ui/react-tabs";
import PendingDoctors from "./_components/PendingDoctors";
import VerifiedDoctors from "./_components/VerifiedDoctors";

const page = async() => {
 
  const [pendingDoctorsData, verifiedDoctorsData] = await Promise.all([
    getPendingDoctors(),
    getVerifiedDoctors(),
  ]);

  return (
    <div className="md:col-span-3">
      <TabsContent value="pending">
       
          <PendingDoctors
            pendingDoctors={pendingDoctorsData.data?.pendingDoctors|| []}
          />
        
      </TabsContent>
      <TabsContent value="doctors">
       
          <VerifiedDoctors
            verifiedDoctors={verifiedDoctorsData?.data?.verifiedDoctors|| []}
          />
        
      </TabsContent>
    </div>
  );
};

export default page;
