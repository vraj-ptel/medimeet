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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import useFetch from "@/hooks/useFetch";
import { User } from "@/lib/generated/prisma";
import { updateDoctorStatus } from "@/utils/actions/admin";
import { format } from "date-fns";
import {
  Check,
  ExternalLink,
  FileText,
  Medal,
  User2,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import { PropagateLoader } from "react-spinners";
import { toast } from "sonner";

const PendingDoctors = ({ pendingDoctors }: { pendingDoctors: User[] }) => {
  const [selectedDoctors, setSelectedDoctors] = useState<User | null>(null);
  const { fn, data, error, isLoading } = useFetch(updateDoctorStatus);
  const handleViewDetails = (doc: User) => {
    setSelectedDoctors(doc);
  };
  const handleCloseDialog = () => {
    setSelectedDoctors(null);
  };
  const handleUpldateStatus=async(doctorId:string,status:string)=>{
    if(isLoading){
      return
    }
    const formData=new FormData();
    formData.append("doctorId",doctorId);
    formData.append("status",status);
   await fn(formData);
  }
  useEffect(()=>{
    if(data && data.success){
      toast.success("status updated successfully");
      setSelectedDoctors(null)
    }
  },[data])
  return (
    <div>
      <Card className="bg-emerald-900/20 border-emerald-400/30">
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl">
            Pending Doctor Verification
          </CardTitle>
          <CardDescription>
            Review And Approve Doctor Application
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingDoctors.length > 0 ? (
            <div className="space-y-4">
              {pendingDoctors.map((doc: User, index: number) => {
                return (
                  <>
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
                              className="h-fit bg-amber-900/20 border-amber-900/30 text-amber-400"
                            >
                              Pending
                            </Badge>
                            <Button
                              variant={"outline"}
                              onClick={() => {
                                handleViewDetails(doc);
                              }}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    {selectedDoctors && (
                      <>
                        <Dialog
                          open={!!selectedDoctors}
                          onOpenChange={handleCloseDialog}
                        >
                          <DialogContent className="md:min-w-3xl md:max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>
                                Doctor Verification Information
                              </DialogTitle>
                              <DialogDescription>
                                Please review the doctor's information before
                                making decision
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6 py-4">
                              {/* Basic Info */}
                              <div className="flex flex-col md:flex-row gap-6">
                                <div className="space-y-1 flex-1">
                                  <h4 className="text-sm font-medium text-muted-foreground">
                                    Full Name
                                  </h4>
                                  <p className="text-base font-medium text-white">
                                    {selectedDoctors.name}
                                  </p>
                                </div>
                                <div className="space-y-1 flex-1">
                                  <h4 className="text-sm font-medium text-muted-foreground">
                                    Email
                                  </h4>
                                  <p className="text-base font-medium text-white">
                                    {selectedDoctors.email}
                                  </p>
                                </div>
                                <div className="space-y-1 flex-1">
                                  <h4 className="text-sm font-medium text-muted-foreground">
                                    Application Date
                                  </h4>
                                  <p className="text-base font-medium text-white">
                                    {format(
                                      new Date(selectedDoctors.createdAt),
                                      "PPP"
                                    )}
                                  </p>
                                </div>
                              </div>
                              <Separator className="bg-emerald-900/20" />

                              {/* Professional Details */}
                              <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                  <Medal className="h-5 w-5 text-emerald-400" />
                                  <h3 className="text-white font-medium">
                                    Professional Information
                                  </h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                                  <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-muted-foreground">
                                      Specialty
                                    </h4>
                                    <p className="text-white">
                                      {selectedDoctors.specialty}
                                    </p>
                                  </div>

                                  <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-muted-foreground">
                                      Years of Experience
                                    </h4>
                                    <p className="text-white">
                                      {selectedDoctors.experience} years
                                    </p>
                                  </div>

                                  <div className="space-y-1 col-span-2">
                                    <h4 className="text-sm font-medium text-muted-foreground">
                                      Credentials
                                    </h4>
                                    <div className="flex items-center">
                                      <a
                                        href={
                                          selectedDoctors.credentialUrl as string
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-emerald-400 hover:text-emerald-300 flex items-center"
                                      >
                                        View Credentials
                                        <ExternalLink className="h-4 w-4 ml-1" />
                                      </a>
                                    </div>
                                  </div>
                                </div>

                                <Separator className="bg-emerald-900/20" />

                                {/* Description */}
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-emerald-400" />
                                    <h3 className="text-white font-medium">
                                      Service Description
                                    </h3>
                                  </div>
                                  <p className="text-muted-foreground whitespace-pre-line">
                                    {selectedDoctors.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                            {isLoading && (
                              <div className="w-full flex items-center justify-center">
                                <PropagateLoader color="#36d7b7" />
                              </div>
                            )}
                            <DialogFooter>
                              <Button
                              disabled={isLoading}
                              onClick={()=>handleUpldateStatus(selectedDoctors.id,'REJECTED')}
                                variant={"default"}
                                className="bg-red-400 hover:bg-red-400/90 text-white transition-all cursor-pointer"
                              >
                                <X /> Reject
                              </Button>
                              <Button
                                variant={"default"}
                                  onClick={()=>handleUpldateStatus(selectedDoctors.id,'VERIFIED')}
                                disabled={isLoading}
                                className="bg-emerald-400 cursor-pointer hover:bg-emerald-400/90 text-white transition-all"
                              >
                                <Check/>Approve
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </>
                    )}
                  </>
                );
              })}
            </div>
          ) : (
            <>
              <p className="text-foreground/30">
                No Pending Doctors Verification Found This Time
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PendingDoctors;
