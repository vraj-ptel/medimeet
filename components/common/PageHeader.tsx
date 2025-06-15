import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";

const PageHeader = ({
  icon,
  title,
  backLink = "/",
  backLabel = "Back To Home",
}: {
  icon: any;
  title: string;
  backLink?: string;
  backLabel?: string;
}) => {
  return (
    <div className="flex flex-col justify-between gap-5 mb-8">
      <Link href={backLink}>
        <Button size={'sm'} variant={'outline'} className="cursor-pointer">
          <ArrowLeft className="mr-2 h-4 w-4"></ArrowLeft>
          <span>{backLabel}</span>
        </Button>
      </Link>
      <div className="flex flex-row gap-4">{icon && <div className="text-emerald-400">
            {React.cloneElement(icon,{
                className:"h-12 w-12 md:h-14 md:w-14"
            })}
        </div>}
        <h1 className="text-3xl md:text-4xl font-bold gradient-title">{title}</h1>
        </div>
    </div>
  );
};

export default PageHeader;
