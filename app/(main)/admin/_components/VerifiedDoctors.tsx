"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useFetch from "@/hooks/useFetch";
import { User } from "@/lib/generated/prisma";
import { suspendDoctor } from "@/utils/actions/admin";
import { Ban, Loader2, Search, User2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const VerifiedDoctors = ({ verifiedDoctors }: { verifiedDoctors: User[] }) => {
  const [searchItem, setSearchItem] = useState<string>("");
  const [targetDoctor, setTargetDoctor] = useState<User | null>(null);
  const { fn, data, error, isLoading } = useFetch(suspendDoctor);
  console.log("verifiedDoctors", verifiedDoctors);
  const filteredDoctor = verifiedDoctors.filter((doc: User, index: number) => {
    const query = searchItem.toLowerCase();
    const name = doc.name.toLowerCase();
    const email = doc.email.toLowerCase();
    const specialty = doc.specialty?.toLowerCase().includes(query);
    return name.includes(query) || email.includes(query) || specialty;
  });
  const  handleUpdateStatus=async(doc:User,status:string)=>{
    // console.log("doc",doc);
    setTargetDoctor(doc);
    const formData=new FormData();
    formData.append("doctorId",doc.id);
    formData.append("suspend",status);
    await fn(formData);
  }
  useEffect(()=>{
    if(data && data.success){
      toast.success("doctor suspended successfully");
    }
  },[data])
  
  return (
    <div>
      <Card className="bg-emerald-900/20 border-emerald-400/30">
        <CardHeader>
          <div className="space-y-7">
            <div>
              <CardTitle className="text-xl font-bold text-white">
                Manage Doctor
              </CardTitle>
              <CardDescription>
                View and manage all verified doctors
              </CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute top-2 left-2 h-4 w-4 text-muted-foreground"></Search>
              <Input
                placeholder="search doctors.."
                className="pl-8 bg-background border-emerald-900/20"
                value={searchItem}
                onChange={(e) => setSearchItem(e.target.value)}
              ></Input>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div>
            {filteredDoctor.length == 0 ? (
              <div>
                {searchItem ? (
                  <div className="text-muted-foreground/30">
                    no doctors match your search critaria
                  </div>
                ) : (
                  <div className="text-muted-foreground/30">
                    there is no doctor verified
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                  {filteredDoctor.map((doc:User,index:number)=>{
                    return (
                    <Card
                      key={index}
                      className="bg-emerald-900/30 border-emerald-400/40"
                    >
                      <CardContent>
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div>
                            <div className="bg-muted/20 rounded-full p-2">
                              <User2 className="h-5 w-5 text-emerald-400" />
                            </div>
                            <div>
                              <h3 className="font-medium text-white">
                                {doc.name}
                              </h3>
                              <p className="text-muted-foreground/40">
                                {doc.specialty}
                                {"  "} - {doc.experience} year of experience
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-center  md:flex-row gap-5">
                            <Badge
                              variant={"outline"}
                              className="h-fit bg-emerald-900/20 border-emerald-900/30 text-emerald-400"
                            >
                              Active
                            </Badge>
                            <Button
                            disabled={isLoading}
                              variant={"default"}
                              onClick={() => {
                                handleUpdateStatus(doc, "SUSPEND");
                              }}
                              className="h-fit bg-red-900/30 hover:bg-red-900/40 cursor-pointer border-red-900/30 text-red-400"
                            >
                              {(isLoading && targetDoctor?.id === doc.id)?<><Loader2 className="h-4 w-4 animate-spin"/></>:<> <Ban className="h-4 w-4 mr-1 "/></>}
                              Suspend
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>)
                  })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifiedDoctors;
