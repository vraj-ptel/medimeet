"use client";
import useFetch from "@/hooks/useFetch";
import { Appointment } from "@/lib/generated/prisma";
import { generateVideoToken } from "@/utils/actions/appointment";
import {
  addAppointmentsNotes,
  cancelAppointment,
  markAppointmentDone,
} from "@/utils/actions/doctor";
import { DialogTitle } from "@radix-ui/react-dialog";
import { format } from "date-fns";
import {
  Calendar,
  Check,
  Clock,
  Edit,
  Loader2,
  Stethoscope,
  User,
  Video,
  X
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";

const Appointmentcard = ({
  appointment,
  userRole,
}: {
  appointment: Appointment;
  userRole: "PATIENT" | "DOCTOR";
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<
    "Cancel" | "Notes" | "Video" | "Complete " | null
  >(null);
  const [notes, setNotes] = useState(appointment.notes);
  const {
    isLoading: cancelLoading,
    fn: submitCancel,
    data: cancelData,
  } = useFetch(cancelAppointment);
  const {
    isLoading: notesLoading,
    fn: submitNotes,
    data: notesData,
  } = useFetch(addAppointmentsNotes);
  const {
    isLoading: tokenLoading,
    fn: submitTokenRequest,
    data: tokenData,
  } = useFetch(generateVideoToken);
  const {
    isLoading: completeLoading,
    fn: submitMarkCompleted,
    data: completeData,
  } = useFetch(markAppointmentDone);
  // console.log("appointment", appointment);
  const otherParty =
    // @ts-expect-error
    //
    userRole === "DOCTOR" ? appointment?.patient : appointment?.doctor;
  // console.log("otherParty", otherParty);
  const otherParyIcon =
    otherParty.role === "DOCTOR" ? <Stethoscope /> : <User />;
  const otherParyLabel = userRole === "DOCTOR" ? "Patient" : "Doctor";

  const formatDateTime = (dateString: any) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy 'at' hh:mm a");
    } catch (error) {
      return "invalid date";
    }
  };
  const formatTime = (dateString: any) => {
    try {
      return format(new Date(dateString), " hh:mm a");
    } catch (error) {
      return "invalid date";
    }
  };
  function canMarkCompleted() {
    if (userRole !== "DOCTOR" || appointment.status !== "SCHEDULED") {
      return false;
    }
    const now = new Date();

    const appointmentEndTime = new Date(appointment.endTime);
    console.log("appointment mark", now, appointmentEndTime);
    return now >= appointmentEndTime;
  }

  async function handleMarkComplete() {
    if (completeLoading) {
      return;
    }
    if (
      window.confirm(
        "are you sure you want to mark this appointment as complete"
      )
    ) {
      const formData = new FormData();
      formData.append("applicationId", appointment.id);
      await submitMarkCompleted(formData);
    }
  }

  // when can user join video call
  const isAppointMentActive = () => {
    const now = new Date();
    const appointmentStartTime = new Date(appointment.startTime);
    const appointmentEndTime = new Date(appointment.endTime);

    //  user can join 30 minute before start time
    return (
      (appointmentStartTime.getTime() - now.getTime()) / (1000 * 60) <= 30 &&
      (now <= appointmentStartTime ||
        (now >= appointmentStartTime && now <= appointmentEndTime))
    );
  };
  //handle video join
  const   handleVideoJoin = async () => {
    if (tokenLoading) return;
    const formData = new FormData();
    formData.append("appointmentId", appointment.id);
    await submitTokenRequest(formData);
  };
  //user effect for video join token
  useEffect(() => {
    if (tokenData?.success) {
      console.log("tokenData", tokenData);
      router.push(
        `video-call?sessionId=${tokenData.data.videoSessionId}&token=${tokenData.data.videoSessionToken}&appointmentId=${appointment.id}`
      );
    }
  }, [tokenData, appointment.id]);

  useEffect(() => {
    if (completeData?.success) {
      toast.success("appointment marked as complete");
      setOpen(false);
    }
  }, [completeData]);
  //handle save notes
  const handleSaveNotes = async () => {
    if (notesLoading && userRole !== "DOCTOR") return;
    const formData = new FormData();
    formData.append("appointmentId", appointment.id);
    formData.append("notes", notes as string);

    await submitNotes(formData);
  };
  //save notes use effect
  useEffect(() => {
    if (notesData?.success) {
      toast.success("notes saved successfully");
      setAction(null);
    }
  }, [notesData]);

  //handle cancel appointment
  const handleCancelAppointment = async () => {
    if (cancelLoading) return;
    if (
      window.confirm(
        "are you sure you want to cancel this appointment ? you can not undone this action"
      )
    ) {
      const formData = new FormData();
      formData.append("appointmentId", appointment.id);
      await submitCancel(formData);
    }
  };
  //handle cancel useEffect
  useEffect(() => {
    if(!cancelLoading || cancelData){
      setOpen(false)
    }
    if (cancelData?.success) {
      toast.success("appointment cancelled successfully");
      setOpen(false);
    }
  }, [cancelData,cancelLoading]);
  return (
    <div>
      <Card className="bg-emerald-900/25">
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className=" flex items-start gap-3">
              <div>
                <div>{otherParyIcon}</div>
                <h3 className="font-medium text-white">
                  {userRole === "DOCTOR"
                    ? otherParty.name
                    : `Dr. ${otherParty.name}`}
                </h3>
                {userRole === "PATIENT" && (
                  <p className="text-muted-foreground/40">
                    {otherParty.secialty}
                  </p>
                )}
                <div className="flex items-center mt-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4"></Calendar>
                  <span>{formatDateTime(appointment.startTime)}</span>
                </div>
                <div className="flex items-center mt-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>
                    {formatTime(appointment.startTime)}{" "}
                    {formatTime(appointment.endTime)}
                  </span>
                </div>
              </div>
            </div>
            <div className=" flex flex-col items-center md:items-end gap-5 self-end md:self-start">
              <Badge
                className={
                  appointment.status === "COMPLETED"
                    ? "bg-emerald-900/20 border-emerald-900/30 text-emerald-400"
                    : appointment.status === "CANCELLED"
                    ? "bg-red-900/20 border-red-900/30 text-red-400"
                    : "bg-amber-900/20 border-amber-900/30 text-amber-400"
                }
              >
                {appointment.status}
              </Badge>
              <div className="flex gap-2">
                {canMarkCompleted() && (
                  <Button
                    disabled={completeLoading}
                    size={"sm"}
                    variant={"outline"}
                    className="cursor-pointer"
                    onClick={() => handleMarkComplete()}
                  >
                    {completeLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading..
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" /> Complete
                      </>
                    )}
                  </Button>
                )}
                <Button
                  size={"sm"}
                  onClick={() => setOpen(true)}
                  className="bg-emerald-400/70 hover:bg-emerald-500/70 cursor-pointer text-white"
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* appointment detail dialoggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg  */}
      <Dialog open={open} onOpenChange={setOpen}>
        {/* <DialogTrigger>open</DialogTrigger> */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">Appointment</DialogTitle>
            <DialogDescription>
              {appointment.status == "SCHEDULED"
                ? "manage your upcoming appointment"
                : "view appointment information"}
            </DialogDescription>
          </DialogHeader>

          <div>
            {/* other party info  */}
            <div>
              <div className="flex gap-2 flex-col">
                <h4 className="text-muted-foreground">{otherParyLabel}</h4>
                <div className="flex items-center gap-2">
                  <div className="text-emerald-400">{otherParyIcon}</div>
                  <div>
                    <p className="font-medium">
                      {userRole == "PATIENT"
                        ? `Dr. ${otherParty.name}`
                        : otherParty.name}
                    </p>

                    {userRole == "DOCTOR" ? (
                      <p className="text-muted-foreground flex flex-row items-center gap-1">
                        {otherParty.email}
                      </p>
                    ) : null}
                    {userRole == "PATIENT" ? (
                      <p className="text-muted-foreground">
                        {otherParty.secialty}
                      </p>
                    ) : null}
                  </div>
                </div>
                {/* appointment time  */}
                <div className="spce-y-2">
                  <h4 className="text-muted-foreground">Schedule Time</h4>
                  <div>
                    <div className="flex flex-row gap-2 items-center">
                      <Calendar className="h-4 w-4 text-emerald-400 mr-2" />
                      <p>{formatDateTime(appointment.startTime)}</p>
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                      <Clock className="h-4 w-4 text-emerald-400 mr-2" />
                      <p>
                        {formatTime(appointment.startTime)} -{" "}
                        {formatTime(appointment.endTime)}
                      </p>
                    </div>
                    <div className="py-3">
                      <Badge
                        className={
                          appointment.status === "COMPLETED"
                            ? "bg-emerald-900/20 border-emerald-900/30 text-emerald-400"
                            : appointment.status === "CANCELLED"
                            ? "bg-red-900/20 border-red-900/30 text-red-400"
                            : "bg-amber-900/20 border-amber-900/30 text-amber-400"
                        }
                      >
                        {appointment.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                {/* patient descritpion  */}
                <div>
                  {appointment.patientDescription && (
                    <div className="flex flex-col gap-1">
                      <h4 className="text-muted-foreground">
                        {userRole == "DOCTOR"
                          ? "Patient Description"
                          : "Your Description"}
                      </h4>
                      <div className="bg-emerald-400/5 p-3 rounded-md">
                        <p className="text-muted-foreground">
                          {appointment.patientDescription}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* join video call button  */}
              <div className=" my-3">
                {appointment.status == "SCHEDULED" && (
                  <div className="flex flex-col gap-2">
                    <h4 className="text-muted-foreground">
                      Video Consultation
                    </h4>
                    <div className="flex justify-around">
                      {isAppointMentActive() ? (
                        <Button
                          size={"sm"}
                          onClick={() => handleVideoJoin()}
                          disabled={tokenLoading || action == "Video"}
                          className="bg-emerald-400/70 hover:bg-emerald-500/70 cursor-pointer text-white "
                        >
                          {tokenLoading || action == "Video" ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Preparing Video Call
                            </>
                          ) : (
                            <>
                              <Video className="h-4 w-4" />
                              join video call
                            </>
                          )}
                        </Button>
                      ) : (
                        <p className="bg-emerald-400/70 cursor-not-allowed  p-2 opacity-50 items-start rounded-sm">
                         <span className="grid col-span-1 "> <Video className="h-4 w-4" /></span>
                          <span>video call will be available before 30 minutes of appointment</span>
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* edit notes  */}
            <div>
              <div className="flex flex-row justify-between py-3">
                <h4 className="text-muted-foreground">Doctor Notes</h4>
                {userRole === "DOCTOR" &&
                  action !== "Notes" &&
                  appointment.status !== "CANCELLED" && (
                    <Button
                      size={"sm"}
                      onClick={() => setAction("Notes")}
                      variant={"ghost"}
                      className="text-emerald-400"
                    >
                      <Edit className="h-4 w-4" />
                      {appointment.notes ? "Edit Notes" : "Add Notes"}
                    </Button>
                  )}
              </div>
              {userRole == "DOCTOR" && action == "Notes" ? (
                <div>
                  <Textarea
                    value={notes as string}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="enter your clinical notes"
                    className="bg-emerald-400/5 p-3 rounded-md min-h-[100px]"
                  ></Textarea>
                  <div className="my-3 flex gap-2">
                    <Button
                      size={"sm"}
                      variant={"outline"}
                      onClick={() => {
                        setAction(null);
                        setNotes(appointment.notes || "");
                      }}
                      disabled={notesLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      size={"sm"}
                      className="bg-emerald-400/70 hover:bg-emerald-500/70"
                      disabled={notesLoading}
                      onClick={handleSaveNotes}
                    >
                      {notesLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving Your Notes
                        </>
                      ) : (
                        "Save"
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  {appointment.notes ? (
                    <div className="bg-emerald-400/5 p-3 rounded-md">
                      <p className="text-white whitespace-pre-line">
                        {appointment.notes}
                      </p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">
                      no notes added yet
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            {/* cancel appointment button  */}
            {appointment.status == "SCHEDULED" && (
              <div>
                <Button
                  className="cursor-pointer"
                  variant={"outline"}
                  onClick={handleCancelAppointment}
                  disabled={cancelLoading}
                >
                  {cancelLoading ? (
                    <div className="flex gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Cancelling..
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <X className="h-4 w-4 mr-1" />
                      Cancel Appointment
                    </div>
                  )}
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Appointmentcard;
