"use client";
import { useState } from "react";
import { toast } from "sonner";

// Define a generic function type that returns a Promise
type AsyncFunction<TArgs extends any[] = any[], TResult = response> = (
  ...args: TArgs
) => Promise<TResult>;

interface response {
  success: boolean;
  data?: any;
  error?: Error | any;
}
const useFetch = <TArgs extends any[] , TResult = response>(
  cb: (...args: any[]) => Promise<any>
) => {
  const [data, setData] = useState<TResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fn = async (...args: TArgs) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await cb(...args);
      if (res?.data) {
        setData(res);
        // console.log("dkfjlkdjfksdjfsd", res.data);
      }
      if (res.success === false) {
        setError(res.error.message);
        toast.error(res.error.message || "Something went wrong");
        console.log("error",res.error)
        // throw new Error(res.error.message);
      }
      return res;
    } catch (error) {
      console.log("error", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, fn };
};

export default useFetch;
