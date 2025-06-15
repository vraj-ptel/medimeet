import Pricing from "@/components/Pricing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BackpackIcon } from "lucide-react";
import Link from "next/link";

const page = () => {
  return (
    <div className="py-20 pb-0 lg:py-20 lg:pb-0 px-10">
      <div className="container mx-auto my-4">
        <Link href="/" className="cursor-pointer hidden sm:block">
          <Button
            variant={"outline"}
            size={"sm"}
            className="cursor-pointer border-emerald-400/30"
          >
            <ArrowLeft />   Back To Home
          </Button>
        </Link>
      </div>
      <div className="max-w-full items-center justify-center text-center flex flex-col gap-5">
        <Badge
          variant={"outline"}
          className="bg-emerald-900/30 border-emerald-700/30 text-emerald-400 px-4 py-2 text-sm font-medium"
        >
          Affordable Healthcare
        </Badge>
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold gradient-title ">
            Simple,Transparent Pricing
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl ">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestias
            quisquam consequuntur aperiam quae, est ab praesentium ducimus harum
            illo fugiat.
          </p>
        </div>
      </div>
      <Pricing />
    </div>
  );
};

export default page;
