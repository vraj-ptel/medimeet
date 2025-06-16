"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import useFetch from "@/hooks/useFetch";
import { Payout } from "@/lib/generated/prisma";
import { generatePayout } from "@/utils/actions/payout";
import { format } from "date-fns";
import {
  BarChart,
  Briefcase,
  Coins,
  CreditCard,
  DollarSign,
  Loader2,
  TrendingUp,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type EarningType = {
  allPayouts: Payout[];
  avgWeeklyEarning: number;
  totalEarning: number;
  totalCredit: number;
  totalAppointments: number;
  totalPayOutEarning: number;
  totalPlatFormFee: number;
  thisMonthEarning: number;
    displayTotalEarning:number
};
const Earning = ({
    displayTotalEarning,
  allPayouts,
  avgWeeklyEarning,
  thisMonthEarning,
  totalEarning,
  totalCredit,
  totalAppointments,
  totalPayOutEarning,
  totalPlatFormFee,
}: EarningType) => {
  const [open, setOpen] = useState(false);
  const handleDialogChange = () => {
    setOpen((prev) => !prev);
  };
  const [paypalEmail, setPaypalEmail] = useState("");

  const { data, isLoading, error, fn } = useFetch(generatePayout);

  useEffect(() => {
    if (error) {
      
      toast.error((error as unknown as Error).message);
      console.log("error in request payment", error);
    }

    if (data?.success && !isLoading) {
      toast.success("payment request sent successfully");
      setOpen(false);
    }
  }, [error, data, isLoading]);

  //request payment
  const requestPayment = async () => {
    if (!paypalEmail) {
      toast.error("paypal id is required");
      return;
    }
    const formData = new FormData();
    formData.append("paypalEmail", paypalEmail);
    formData.append("totalAmount", totalEarning.toString());
    formData.append("platFormFee", totalPlatFormFee.toString());
    formData.append("totalCredits", totalCredit.toString());
    formData.append("netAmount", totalPayOutEarning.toString());
    await fn(formData);
    //call action
  };
  return (
    <Card className="bg-emerald-900/20 w-full border-emerald-400/30 rounded-2xl">
      {/* Header */}
      <CardHeader>
        <CardTitle className="text-3xl md:text-4xl font-bold text-white drop-shadow">
          Your Earnings With <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-600 bg-clip-text text-transparent">Medimeet</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 p-2 md:p-6">
          <Compo
            icon={<BarChart className="h-8 w-8 text-emerald-300" />}
            data={`${avgWeeklyEarning}`}
            subtitle="in a month"
            title="avg weekly earning"
          />
          <Compo
            icon={<TrendingUp className="h-8 w-8 text-emerald-300" />}
            data={`${totalCredit}`}
            title={"total credits"}
          />
          <Compo
            icon={<Coins className="h-8 w-8 text-emerald-300" />}
            data={`${displayTotalEarning}`}
            title={"total earning"}
          />
          <Compo
            icon={<Briefcase className="h-8 w-8 text-emerald-300" />}
            data={`${totalAppointments}`}
            subtitle="completed"
            title={"total appointments"}
          />
        </div>

        {/* Payout Details */}
        {totalCredit > 0 && (
          <Card className="bg-gradient-to-r from-emerald-900/60 to-emerald-800/40 w-full border-emerald-400/30 shadow-md rounded-xl mt-6">
            <CardHeader>
              <div className="flex flex-row justify-between items-center">
                <CardTitle className="flex flex-row gap-2 items-center text-emerald-200">
                  <span>
                    <CreditCard className="h-6 w-6 text-emerald-300" />
                  </span>
                  <h4 className="text-base font-semibold">Payout Management</h4>
                </CardTitle>
                <Badge
                  variant={"outline"}
                  className="bg-emerald-900/30 border-emerald-400/40 text-emerald-200 px-2 py-1 text-xs font-semibold"
                >
                  Available
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-muted-foreground text-xs">Available Credits</p>
                  <p className="text-lg font-bold text-white">{totalCredit}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Payout Amount</p>
                  <p className="text-lg font-bold text-white">${totalPayOutEarning}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Platform Fee</p>
                  <p className="text-lg font-bold text-white">${totalPlatFormFee}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <PayOutHistory allPayouts={allPayouts} />
      </CardContent>
      {/* Dialog */}
      <Dialog open={open} onOpenChange={handleDialogChange}>
        <DialogContent className="rounded-2xl bg-gradient-to-br from-emerald-950/90 to-emerald-800/80 border-emerald-400/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-emerald-200">Request Payout</DialogTitle>
            <DialogDescription className="capitalize text-emerald-100">
              Request Pay Out For All Your Available Credits
            </DialogDescription>
          </DialogHeader>

          <Card className="p-4 bg-emerald-900/40 rounded-xl">
            <div className="flex justify-between mb-2">
              <p className="text-muted-foreground">Available Credit:</p>
              <p className="font-semibold text-white">{totalCredit}</p>
            </div>
            <div className="flex justify-between mb-2">
              <p className="text-muted-foreground">Gross Amount:</p>
              <p className="font-semibold text-white">${totalEarning}</p>
            </div>
            <div className="flex justify-between mb-2">
              <p className="text-muted-foreground">Platform Fee:</p>
              <p className="font-semibold text-red-300">-${totalPlatFormFee}</p>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between">
              <p className="font-semibold text-white">Net Amount:</p>
              <p className="text-emerald-400 font-bold text-lg">${totalPayOutEarning}</p>
            </div>
          </Card>

          <div className="space-y-2 mt-4">
            <Label htmlFor="email" className="text-emerald-200">Paypal Email</Label>
            <Input
              required
              id="email"
              value={paypalEmail}
              onChange={(e) => setPaypalEmail(e.target.value)}
              type="email"
              placeholder="example-email@Paypal.com"
              className="bg-emerald-950/60 border-emerald-400/20 text-white placeholder:text-emerald-300 focus:ring-emerald-400"
            />

            <p className="text-muted-foreground text-xs">
              Enter your PayPal email where you want to receive your payout
            </p>
          </div>
          <DialogFooter>
            <Button
              variant={"outline"}
              className="cursor-pointer flex flex-row gap-2 border-emerald-400/40 text-emerald-200 hover:bg-emerald-800/40 hover:text-white transition"
              onClick={requestPayment}
            >
              {isLoading ? (
                <span className="flex flex-row gap-2">
                  <Loader2 className="animate-spin" />
                  loading..
                </span>
              ) : (
                "Request Payout"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Card Footer */}
      <CardFooter>
        {totalCredit > 0 && (
          <div className="w-full flex items-center justify-center">
            <Button
              onClick={() => setOpen(true)}
              variant={"outline"}
              className="cursor-pointer border-emerald-400/40 text-emerald-200 hover:bg-emerald-800/40 hover:text-white transition font-semibold px-6 py-2 rounded-lg shadow"
            >
              Pay Out Your Earnings
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

const Compo = ({
  icon,
  data,
  title,
  subtitle,
}: {
  title: string;
  icon: React.ReactNode;
  data: string;
  subtitle?: string;
}) => {
  return (
    <Card className="bg-gradient-to-br from-emerald-900/60 to-emerald-800/40 w-full border-emerald-400/30 shadow rounded-xl hover:scale-[1.02] hover:shadow-lg transition-transform">
      <CardContent>
        <div className="flex justify-between items-center gap-2 min-h-[90px]">
          <div>
            <h4 className="text-xl md:text-2xl capitalize font-semibold text-white drop-shadow-sm">{title}</h4>
            <p className="text-emerald-200 text-lg font-bold">{data}</p>
            {subtitle && <p className="text-muted-foreground text-xs mt-1">{subtitle}</p>}
          </div>
          <div className="flex items-center justify-center bg-emerald-950/40 rounded-full p-2 shadow-inner">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
const PayOutHistory = ({ allPayouts }: { allPayouts: Payout[] }) => {
  return (
    <Card className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 w-full border-emerald-400/30 my-8 shadow rounded-xl">
      <CardHeader>
        <CardTitle className="flex flex-row gap-2 items-center text-emerald-200">
          <span>
            <DollarSign className="h-6 w-6 text-emerald-300" />
          </span>
          <h4 className="text-base font-semibold">Payout History</h4>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          {allPayouts?.length === 0 ? (
            <div className="text-center py-8 flex flex-col items-center justify-center">
              <div className="flex flex-row gap-2 items-center">
                <CreditCard className="h-6 w-6 text-emerald-300" />
                <h3 className="text-lg font-semibold text-white">No Payout Data</h3>
              </div>
              <p className="capitalize text-muted-foreground text-sm mt-2">
                You don't have any payout history
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {allPayouts.map((payout) => {
                return (
                  <Card className="bg-emerald-950/30 border-emerald-400/10 rounded-lg" key={payout.id}>
                    <CardContent className="flex flex-col md:flex-row gap-2 justify-between items-center py-3 px-2">
                      {/* left div */}
                      <div className="flex items-start flex-col">
                        <h6 className="text-emerald-200 font-semibold">{format(payout.createAt, "PP")}</h6>
                        <p className="text-muted-foreground text-xs">
                          {payout.credits} credits - ${payout.netAmount}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {payout.paypalEmail}
                        </p>
                      </div>
                      {/* right div  */}
                      <div>
                        <Badge
                          className={
                            payout.status === "PROCESSING"
                              ? "bg-amber-900/30 border-amber-900/30 text-amber-300 font-semibold px-3 py-1"
                              : "bg-emerald-900/30 border-emerald-900/30 text-emerald-300 font-semibold px-3 py-1"
                          }
                        >
                          {payout.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Earning;
