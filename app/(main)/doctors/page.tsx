import { Card, CardContent } from "@/components/ui/card";
import { SPECIALTIES } from "@/lib/specialities";
import Link from "next/link";

const page = () => {
  return (
    <div className="min-h-screen  py-8 px-2 md:px-8">
      <div className="flex flex-col w-full items-center justify-center space-y-4 mb-8">
        <h1 className="text-3xl md:text-5xl font-extrabold gradient-title drop-shadow-lg text-center">Find Your Doctor</h1>
        <p className="text-lg md:text-xl text-foreground/30 max-w-2xl text-center">
          Discover top specialists by category. Select a specialty to view expert doctors and book your appointment easily.
        </p>
      </div>
      <div className="my-4 md:my-8 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {SPECIALTIES.map((spe, index) => (
          <Link
            key={spe.name}
            className="w-full h-full"
            href={`/doctors/${spe.name}`}
          >
            <Card className="h-full  border-none shadow-md hover:shadow-xl hover:scale-[1.03]  transition-all duration-200 cursor-pointer">
              <CardContent className="flex items-center justify-center flex-col py-6 gap-3">
                <div className="w-16 h-16 rounded-full bg-emerald-900/70 flex items-center justify-center mb-2 shadow-inner text-white text-3xl">
                  {spe.icon}
                </div>
                <span className="font-semibold text-emerald-400 text-lg tracking-wide text-center">
                  {spe.name}
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default page;
