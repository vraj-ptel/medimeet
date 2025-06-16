
import { getPendingDoctors, getVerifiedDoctors } from "@/utils/actions/admin";
import { getAllPayouts } from "@/utils/actions/payout";
import { TabsContent } from "@radix-ui/react-tabs";
import Payout from "./_components/Payout";
import PendingDoctors from "./_components/PendingDoctors";
import VerifiedDoctors from "./_components/VerifiedDoctors";

const page = async() => {
 
  const [pendingDoctorsData, verifiedDoctorsData,allPayOut] = await Promise.all([
    getPendingDoctors(),
    getVerifiedDoctors(),
    getAllPayouts()
  ]);
  console.log("all pay outs",allPayOut);

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
       <TabsContent value="payout">
       
          <Payout
          
            allPayOut={allPayOut.data?.allPayOuts|| []}
          />
        
      </TabsContent>
    </div>
  );
};

export default page;
