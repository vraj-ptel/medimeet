"use client"
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/useFetch";
import { SPECIALTIES } from "@/lib/specialities";
import { onboardUser } from "@/utils/actions/onboarding";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import { Step } from "../page";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const doctorSchema = zod.object({
  speciality: zod
    .string({ required_error: "Speciality is required" })
    .min(1, "Speciality is required"),
  experience: zod
    .number({
      required_error: "experience is required",
      invalid_type_error: "experience is required",
    })
    .min(1, "experience is required")
    .max(70, "experience should be less than 70 years"),
  credentialUrl: zod
    .string({ required_error: "credential url is required" })
    .url("please enter a valid url")
    .min(1, "credential url is required"),
  description: zod
    .string({ required_error: "description is required" })
    .min(20, "description must be 20 characters long")
    .max(500, "description must be less than 500 characters long"),
});
type Doctor = zod.infer<typeof doctorSchema>;

const DoctorForm = ({
  setStep,
}: {
  setStep: React.Dispatch<React.SetStateAction<Step>>;
}) => {
    const router=useRouter();
  const { fn, data: selectRoleData, error, isLoading } = useFetch(onboardUser);
  const handleDoctorSelection = async (fields: zod.infer<typeof doctorSchema>) => {
    if (isLoading) {
      return;
    }
    const formData=new FormData();
    formData.append("role","DOCTOR");
    formData.append("credentialUrl",fields.credentialUrl);
    formData.append("specialty",fields.speciality);
    formData.append("experience",fields.experience.toString());
    formData.append("description",fields.description);
    await fn(formData);
  };
  useEffect(()=>{
    if(selectRoleData?.success && !isLoading){
        toast.success("doctor profile created successfully");
        router.push("/doctor/verification");
    }
  },[selectRoleData,isLoading])
  const {
    getValues,
    setValue,
    watch,
    reset,
    formState: { errors },
    register,
    handleSubmit,
  } = useForm({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      speciality: "",
      experience: undefined,
      credentialUrl: "",
      description: "",
    },
  });
  return (
    <div className=" w-[100%]">
      <Card className=" border-emerald-400/30 bg-emerald-900/10  transition-all">
        <CardContent className="flex flex-col gap-4  p-4">
          <CardTitle className="text-3xl md:text-4xl text-center">
            Complete Your Doctor Profile
          </CardTitle>
          <CardDescription className="text-center">
            Please Provide Your Professional Details For Verification
          </CardDescription>
          <form
            className="my-9 space-y-8"
            onSubmit={handleSubmit(handleDoctorSelection)}
          >
            {/* specialities  */}
            <div className="space-y-2 flex flex-col  gap-2 w-full">
              <Label htmlFor="speciality">Medical Speciality</Label>
              <Select
                value={watch("speciality")}
                onValueChange={(e) => setValue("speciality", e)}
              >
                <SelectTrigger id="speciality" className="w-full">
                  <SelectValue placeholder="Select Speciality" />
                </SelectTrigger>
                <SelectContent>
                  {SPECIALTIES.map((speciality: any) => (
                    <SelectItem key={speciality.name} value={speciality.name}>
                      <span>{speciality.icon}</span>
                      {speciality.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.speciality && (
                <span className="text-red-500">
                  {errors.speciality.message}
                </span>
              )}
            </div>
            {/* experience  */}
            <div className="space-y-2 flex flex-col  gap-2 w-full">
              <Label htmlFor="experience">Medical Speciality</Label>
              <Input
                id="experience"
                type="number"
                placeholder="eg. 5"
                min={1}
                {...register("experience", { valueAsNumber: true })}
              ></Input>
              {errors.experience && (
                <span className="text-red-500">
                  {errors.experience.message}
                </span>
              )}
            </div>
            {/* credentialUrl */}

            <div className="space-y-2 flex flex-col  gap-2 w-full">
              <Label htmlFor="credentialUrl">Link To Credential Document</Label>
              <Input
                id="credentialUrl"
                type="url"
                placeholder="https://example.com"
                {...register("credentialUrl")}
              ></Input>
              {errors.credentialUrl && (
                <span className="text-red-500">
                  {errors.credentialUrl.message}
                </span>
              )}
            </div>
            {/* description */}

            <div className="space-y-2 flex flex-col  gap-2 w-full">
              <Label htmlFor="description" className="capitalize">
                description of your service
              </Label>
              <Textarea
                id="description"
                rows={10}
                placeholder=" Descibe Your Expertise,Services And Approch to Patient Care"
                {...register("description")}
              ></Textarea>
              {errors.description && (
                <span className="text-red-500">
                  {errors.description.message}
                </span>
              )}
            </div>
            <div className=" flex items-center  flex-col-reverse gap-5  md:flex-row md:justify-between">
              <Button
                onClick={() => setStep("choose-role")}
                variant={"ghost"}
                className="bg-emerald-400 cursor-pointer"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>

              <Button
                variant={"outline"}
                className="cursor-pointer"
                type="submit"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>Submit For Verification</>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorForm;
