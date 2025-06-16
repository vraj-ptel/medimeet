"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import useFetch from "@/hooks/useFetch";
import { Payout as PayoutType, User } from "@/lib/generated/prisma";
import { approvePayout } from "@/utils/actions/payout";
import { DialogTitle } from "@radix-ui/react-dialog";
import {
  Check,
  CreditCard,
  DollarSign,
  Info,
  Loader2,
  Stethoscope,
  User2
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
export interface a extends PayoutType {
  doctor: User;
}
const Payout = ({ allPayOut }: { allPayOut: a[] }) => {
  return (
    <Card className="bg-emerald-900/30 border-emerald-400 w-full">
      <CardHeader>
        <CardTitle className="text-2xl">pending Payouts</CardTitle>
        <CardDescription>Review And Approve Payout Request</CardDescription>
      </CardHeader>
      <CardContent>
        {allPayOut?.length > 0 ? (
          <div className="space-y-4">
            {allPayOut.map((payout) => {
              return <Pending key={payout.id} payout={payout}></Pending>;
            })}
          </div>
        ) : (
          <div className="text-center py-8 flex flex-col items-center justify-center" >
            
            <div className="flex flex-row gap-2"><CreditCard /><h3>No Payout Data</h3></div>
            <p className="capitalize text-muted-foreground">you don't have any pending payouts</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const Pending = ({ payout }: { payout: a }) => {
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => {
   
      setOpen((prev) => !prev);
    
  };
  return (
    <Card className="bg-emerald-900/30 border-emerald-400/30">
      <CardContent>
        <div className="flex md:justify-between flex-col md:flex-row">
          <div className="flex items-center gap-2">
            <span className="self-start py-2">
              <User2 className="h-6 w-6 text-emerald-400" />
            </span>
            <div>
              <h4 className="text-2xl capitalize ">{payout.doctor.name}</h4>
              <p className="flex flex-col text-muted-foreground">
                {payout.doctor.email}
              </p>
              <p className="text-muted-foreground">{payout.doctor.specialty}</p>
            </div>
          </div>
          <div className="flex-col gap-2 md:flex-row ">
            <Badge
              className={
                payout.status === "PROCESSING"
                  ? `bg-amber-900/20 border-amber-900/30 text-amber-400`
                  : `bg-emerald-900/20 border-emerald-900/30 text-emerald-400`
              }
            >
              {payout.status}
            </Badge>
            <Button
              onClick={handleOpen}
              className="bg-emerald-400/60 hover:bg-emerald-500/70 text-white cursor-pointer"
            >
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
      <PayoutDialog open={open} handleOpen={handleOpen} payout={payout} />
    </Card>
  );
};

const PayoutDialog = ({
  open,
  handleOpen,
  payout,
}: {
  open: boolean;
  handleOpen: () => void;
  payout: a;
}) => {
  const [confirmPayOut, setConfirmPayOut] = useState(false);
  const handleConfirmPayOut = () => {
    
    setConfirmPayOut((prev) => !prev);
  };
  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl md:text-3xl">
            Pay Out Details
          </DialogTitle>
          <DialogDescription className="text-muted-foreground capitalize">
            Approve this pay out Request to provide doctor payment
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="flex flex-row gap-2">
            <Stethoscope className="text-emerald-400" />
            <h4>Doctor Information</h4>
          </div>
          <div className="grid grid-cols-2 my-5">
            <div className="col-span-1 gap-2">
              <p className="text-muted-foreground">name</p>
              <h5>Dr.{payout.doctor.name}</h5>
            </div>
            <div className="col-span-1">
              <p className="text-muted-foreground">email</p>
              <h5>{payout.doctor.email}</h5>
            </div>
            <div className="col-span-1">
              <p className="text-muted-foreground">specialty</p>
              <h5>{payout.doctor.specialty}</h5>
            </div>
            <div className="col-span-1">
              <p className="text-muted-foreground">Current Credits</p>
              <h5>{payout.doctor.credit}</h5>
            </div>
          </div>
          <div className="my-5">
            <div className="flex flex-row gap-2">
              <DollarSign className="text-emerald-400" />
              <h4>Payout Details</h4>
            </div>
            <Card className="bg-emerald-900/20 border-emerald-400 my-4">
              <CardContent className="flex flex-col gap-2">
                <div className="w-full flex justify-between">
                  <p className="text-muted-foreground">Credits To PayOut</p>
                  <h6>{payout.credits}</h6>
                </div>
                <div className="w-full flex justify-between">
                  <p className="text-muted-foreground">Gross Amount</p>
                  <h6>${payout.amount}</h6>
                </div>
                <div className="w-full flex justify-between">
                  <p className="text-muted-foreground">Platform Fee</p>
                  <h6>-${payout.platformFee}</h6>
                </div>
                <Separator />
                <div className="w-full flex justify-between">
                  <p className="">Net Amount</p>
                  <h6 className="text-emerald-400">${payout.netAmount}</h6>
                </div>
                <Separator />
                <div className="flex flex-col gap-1">
                  <p className="text-muted-foreground">PayPal Email</p>
                  <Input value={payout.paypalEmail} disabled />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="my-4 flex flex-row justify-end">
            <Button
              className="bg-emerald-400/70 hover:bg-emerald-500/70 text-white cursor-pointer"
              onClick={handleConfirmPayOut}
            >
              <Check /> Approve
            </Button>
          </div>
        </div>
      </DialogContent>
      <ConfirmPayOutDialog
        payout={payout}
        open={confirmPayOut}
        handleOpen={handleConfirmPayOut}
        handleParentDialog={handleOpen}
      />
    </Dialog>
  );
};

const ConfirmPayOutDialog = ({
  payout,
  open,
  handleOpen,
  handleParentDialog
}: {
  payout: a;
  open: boolean;
  handleOpen: () => void;
  handleParentDialog: () => void;
}) => {

  // const [loading, setLoading] = useState(false);
  const {data,isLoading,error,fn}=useFetch(approvePayout)
  useEffect(()=>{
    if(error){
      //@ts-ignore
      toast.error(error.message)
      console.log("error in request payment",error);
      handleOpen()
      handleParentDialog()
    }
    if(data?.success && !isLoading){
      toast.success("Payout Approved Successfully")
      handleOpen()
      handleParentDialog()
    }

  },[data,error,isLoading])
  const handleConfirmPayOut=async()=>{
    await fn(payout.id);
    
  }
  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl md:text-3xl">
            Confirm Payout
          </DialogTitle>
          <DialogDescription className="text-muted-foreground capitalize">
            Are your sure your want to appove this payout
          </DialogDescription>
        </DialogHeader>
        <Card>
          <CardContent>
            <div className="flex flex-row gap-2 text-muted-foreground">
              <Info className="text-amber-400/30" /> This action will
            </div>
            <div className="p-4">
              <ul className="list-disc list-inside text-muted-foreground">
                <li>
                  Deduct {payout.credits} from Dr.{payout.doctor.name}'s account
                </li>
                <li>Mark The Payout PROCESSED</li>
                <li>This Action Can Not Be Undone</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        <Card className="my-3">
          <CardContent>
            <div className="w-full flex justify-between">
              <p className="text-muted-foreground">Doctor</p>
              <h6>{payout.doctor.name}</h6>
            </div>
            <div className="w-full flex justify-between">
              <p className="text-muted-foreground">Amount To Pay</p>
              <h6 className="text-emerald-400">${payout.netAmount}</h6>
            </div>
            <div className="w-full flex justify-between">
              <p className="text-muted-foreground">PayPal</p>
              <h6>{payout.paypalEmail}</h6>
            </div>
          </CardContent>
        </Card>
          <Button
              className="bg-emerald-400/70 hover:bg-emerald-500/70 text-white cursor-pointer"
              onClick={handleConfirmPayOut}
              disabled={isLoading}
            >
              {isLoading?<><Loader2 className="animate-spin"/>Confirming Pay Out..</>:<><Check /> Confirm Pay Out</>}
              
            </Button>
      </DialogContent>
    </Dialog>
  );
};

export default Payout;
