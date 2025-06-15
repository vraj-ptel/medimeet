import Pricing from "@/components/Pricing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { creditBenefits, features, testimonials } from "@/lib/data";
import banner from "@/public/banner.png";
import { ArrowRight, Check, Stethoscope } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const page = async() => {
  return (
    <div className="py-10 pb-0 lg:py-20 lg:pb-0 bg-background">
      {/* landing page  */}
      <section className="relative overflow-hidden py-32">
        <div className="container mx-auto px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Image
                src={banner}
                alt="banner"
                width={500}
                height={500}
                priority
                className="object-cover "
              ></Image>
            </div>
            <div className="space-y-8">
              <Badge
                variant={"outline"}
                className="bg-emerald-900/30 border-emerald-700/30 text-emerald-400 px-4 py-2 text-sm font-medium"
              >
                Healthcare Made Simple
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold ">
                Connect With Doctors <br />
                <span className="gradient-title"> Anytime, Anywhere</span>
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl max-w-md">
                Book Appointment with Doctors and get expert advice on your
                health issues.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size={"lg"}
                  className="bg-emerald-600 text-white hover:bg-emerald-700 "
                >
                  <Link href={"/onboarding"} className="flex flex-row">
                    {" "}
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size={"lg"}
                  className="bg-emerald-700/30  hover:bg-emerald-700/50 text-white"
                >
                  <Link href={"/doctors"} className="flex flex-row">
                    {" "}
                    Find Doctors <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* about information  */}
      <section className="py-20 bg-muted/30">
        <div className="container  mx-auto px-10">
          <div className="flex flex-col items-center space-y-4">
            <h2 className="text-4xl lg:text font-bold capitalize">
              how it works
            </h2>
            <p className="text-foreground/30">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut,
              excepturi.{" "}
            </p>
          </div>
          <div className="py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((item, index) => {
              return (
                <Card
                  key={index}
                  className="w-full max-w-sm bg-emerald-900/10 ease-in-out hover:translate-y-[-10px] transition-all  hover:bg-emerald-700/20"
                >
                  <CardHeader>
                    <div>{item.icon}</div>
                    <CardTitle className="pt-2">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/30">{item.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* pricing package  */}

      <section className="py-20 bg-muted/30">
        <div className="container  mx-auto px-10">
          <div className="flex flex-col items-center space-y-4">
            <Badge
              variant={"outline"}
              className="bg-emerald-900/30 border-emerald-700/30 text-emerald-400 px-4 py-2 text-sm font-medium"
            >
              Affordable Healthcare
            </Badge>
            <h2 className="text-4xl lg:text font-bold">
              Consultation Packages
            </h2>
            <p className="text-foreground/30">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut,
              excepturi.{" "}
            </p>
          </div>
          <div>
            {/* pricing table  */}
            <Pricing/>
            <div>
              <Card className=" my-4   bg-emerald-900/10 ">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                    <Stethoscope className="h-5 w-5 text-emerald-400"></Stethoscope>
                    How Our Credit System Work
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul>
                    {creditBenefits.map((item, index) => {
                      return (
                        <li key={index} className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-emerald-400"></Check>
                          <p
                            className="text-muted-foreground"
                            dangerouslySetInnerHTML={{ __html: item }}
                          ></p>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      {/* testemonial */}
      <section className="py-20 bg-muted/30">
        <div className="container  mx-auto px-10">
          <div className="flex flex-col items-center space-y-4">
            <Badge
              variant={"outline"}
              className="bg-emerald-900/30 border-emerald-700/30 text-emerald-400 px-4 py-2 text-sm font-medium"
            >
              Success Stories
            </Badge>
            <h2 className="text-4xl lg:text font-bold capitalize">
              What our users say
            </h2>
            <p className="text-foreground/30">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut,
              excepturi.{" "}
            </p>
          </div>
          <div className="py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((item, index) => {
              return (
                <Card
                  key={index}
                  className="w-full max-w-sm bg-emerald-900/10 ease-in-out hover:translate-y-[-10px] transition-all  hover:bg-emerald-700/20"
                >
                  <CardHeader></CardHeader>
                  <CardContent>
                    <div className="flex flex-row gap-3 ">
                      <div className="rounded-full w-12 h-12 bg-emerald-400 flex items-center justify-center">
                        <span>{item.initials}</span>
                      </div>
                      <div>
                        <h4>{item.name}</h4>
                        <p className="text-muted-foreground">{item.role}</p>
                      </div>
                    </div>
                    <p className="p-4  ">"<span className="text-foreground/60">{item.quote}</span>"</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
      {/* get started  */}
      <section className="py-10 bg-muted/30">
        <div className="container  mx-auto px-10">
          <Card className="py-10 grid grid-cols-1 bg-gradient-to-b from-emerald-900/30 to-emerald-900/50 ">
            
            <CardContent>
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl lg:text font-bold ">Ready To Take Control of your healthcare?</h2>
                <p className="text-foreground/30">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo quisquam ducimus, cumque possimus consectetur sint cupiditate at. Id dicta nulla assumenda, et, eum, quod recusandae autem dolor dolores iure doloribus aliquam. Veritatis sequi unde alias, quidem repellendus, modi magnam eligendi dolores architecto esse assumenda. Tempore, iste. Molestiae eum non eius.</p>
                <div className="flex flex-col md:flex-row gap-2">
                  <Button asChild size={'lg'} className="bg-emerald-500 text-white hover:bg-emerald-700">
                    <Link href={'/signup'}>Get Started</Link>
                  </Button>
                   <Button asChild size={'lg'} className="bg-emerald-600 text-white hover:bg-emerald-700">
                    <Link href={'/pricing'}>View Pricing</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default page;
