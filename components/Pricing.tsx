import { PricingTable } from "@clerk/nextjs";

const Pricing = () => {
  return (
    <div className="my-10 ">
      <PricingTable
        appearance={{ elements: { root: { backgroundColor: "#f5f5f5" } } }}
        checkoutProps={{
          appearance: { elements: { drawerRoot: { zIndex: 200 } } },
        }}
      />
    </div>
  );
};

export default Pricing;
