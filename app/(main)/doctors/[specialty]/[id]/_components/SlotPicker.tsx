"use client";
import React, { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { AvailableTimeSloat, slot } from "@/utils/actions/appointment";
import { ChevronRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const SlotPicker = ({
  days,
  onSelectedSlot,
}: {
  days: AvailableTimeSloat[];
  onSelectedSlot: any;
}) => {
  const [selectedSlot, setSelectedSlot] = useState<slot | null>(null);

  const firstDayWithSlot =
    days.find((day, index) => day.slots.length > 0)?.date || days[0].date;
  const [activeTab, setActiveTab] = useState(firstDayWithSlot);
  const handleSlotSelect = (slot: any) => {
    setSelectedSlot(slot);
  };
  const confirmSelection = () => {
    if (selectedSlot) {
      onSelectedSlot(selectedSlot);
    }
  };
  return (
    <div className="space-y-6">
      <Tabs
        defaultValue={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="w-full  justify-start overflow-x-auto bg-emerald-400/30">
          {days.map((day: any, index: any) => {
            return (
              <TabsTrigger
                key={index}
                value={day.date}
                disabled={day.slots.length === 0}
                className={`${
                  day.slots.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                } `}
              >
                <div className="mr-0.5">
                  {format(new Date(day.date), "MMM d")}
                </div>

                <div>{format(new Date(day.date), "EEE")}</div>
              </TabsTrigger>
            );
          })}
        </TabsList>
        {days.map((d: any, index: any) => {
          return (
            <TabsContent value={d.date} key={index}>
              {d.slots.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 my-5">
                  {d.slots.map((slot: any, index: any) => {
                    return (
                     <Card
                      key={slot.startTime}
                      className={`border-emerald-900/20 bg-emerald-500/10 cursor-pointer transition-all ${
                        selectedSlot?.startTime === slot.startTime
                          ? "bg-emerald-900/30 border-emerald-600"
                          : "hover:border-emerald-700/40"
                      }`}
                      onClick={() => handleSlotSelect(slot)}
                    >
                      <CardContent className="p-3 flex items-center">
                        <Clock
                          className={`h-4 w-4 mr-2 ${
                            selectedSlot?.startTime === slot.startTime
                              ? "text-emerald-400"
                              : "text-muted-foreground"
                          }`}
                        />
                        <span
                          className={
                            selectedSlot?.startTime === slot.startTime
                              ? "text-white"
                              : "text-muted-foreground"
                          }
                        >
                          {format(new Date(slot.startTime), "h:mm a")}
                        </span>
                      </CardContent>
                    </Card>
                    );
                  })}
                </div>
              ) : (
                <div className=" w-full text-center text-foreground/70 text-md">
                  no slots available for {format(d.date, "MMM d")}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
      <div className="flex justify-center">
        <Button
          onClick={confirmSelection}
          disabled={!selectedSlot}
          variant={"outline"}
          className="w-full md:w-sm"
        >
          Continue <ChevronRight className="h-4 w-4 text-emerald-400" />
        </Button>
      </div>
    </div>
  );
};

export default SlotPicker;
