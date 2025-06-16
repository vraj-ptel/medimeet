import { getCurrentUser } from "@/utils/actions/checkuser";
import { checkAndAllocateCredits } from "@/utils/actions/credits";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton
} from "@clerk/nextjs";
import {
  CalendarPlusIcon,
  CreditCard,
  Shield,
  Stethoscope,
  User2,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

const Header = async () => {
  const user = await getCurrentUser();
  if (user?.error) {
    console.log(user.error);
    throw new Error(
      (user?.error && typeof user.error === "object" && "message" in user.error
        ? (user.error as { message?: string }).message
        : undefined) || "Something went wrong"
    );
  }
  if (user?.data?.user && user.data?.user.role == "PATIENT") {
    // console.log(user.user)
    await checkAndAllocateCredits(user.data.user);
  }

  return (
    <header className="fixed top-0  w-full bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 z-10 ">
      <nav className="container  mx-auto px-10 h-16 flex items-center justify-between">
        <Link href={"/"}>
          <h2 className="text-2xl font-bold  bg-gradient-to-br from-emerald-400  to-emerald-600 text-transparent bg-clip-text">
            Medimeet
          </h2>
        </Link>
        <div className="flex items-center space-x-2">
          {/* when user is signned IN  */}
          <SignedIn>
            <div className="flex items-center gap-1 sm:gap-3">
              {user?.data?.user.role === "UNASSIGNED" && (
                <Link href="/onboarding">
                  <Button
                    className="cursor-pointer hidden sm:flex flex-row border-emerald-400/20"
                    variant={"outline"}
                  >
                    <User2 className="text-emerald-400" /> Coplete Your Profile
                  </Button>
                  <Button
                    className="cursor-pointer sm:hidden"
                    variant={"ghost"}
                  >
                    <User2 className="text-emerald-400" />
                  </Button>
                </Link>
              )}
              {user?.data?.user.role === "PATIENT" && (
                <Link href="/appointments">
                  <Button
                    className="cursor-pointer hidden sm:flex flex-row border-emerald-400/20"
                    variant={"outline"}
                  >
                    <CalendarPlusIcon className="text-emerald-400" /> My
                    Appointements
                  </Button>
                  <Button
                    className="cursor-pointer sm:hidden"
                    variant={"ghost"}
                  >
                    <CalendarPlusIcon className="text-emerald-400" />
                  </Button>
                </Link>
              )}
              {user?.data?.user.role === "DOCTOR" && (
                <Link href="/onboarding">
                  <Button
                    className="cursor-pointer hidden sm:flex flex-row border-emerald-400/20"
                    variant={"outline"}
                  >
                    <Stethoscope className="text-emerald-400" /> Doctor
                    Dashboard
                  </Button>
                  <Button
                    className="cursor-pointer sm:hidden"
                    variant={"ghost"}
                  >
                    <Stethoscope className="text-emerald-400" />
                  </Button>
                </Link>
              )}
              {user?.data?.user.role === "ADMIN" && (
                <Link href="/admin">
                  <Button
                    className="cursor-pointer hidden sm:flex flex-row border-emerald-400/20"
                    variant={"outline"}
                  >
                    <Shield className="text-emerald-400" /> Admin Dashboard
                  </Button>
                  <Button
                    className="cursor-pointer sm:hidden"
                    variant={"ghost"}
                  >
                    <Shield className="text-emerald-400" />
                  </Button>
                </Link>
              )}
              {(!user || user?.data?.user.role == "PATIENT") && (
                <Link href={"/pricing"}>
                  <Badge
                    variant={"outline"}
                    className="h-9 bg-emerald-900/20 border-emerald-700/30 px-3 py-1 flex items-center gap-2"
                  >
                    <CreditCard className="h-3.5 w-3.5 text-emerald-400"></CreditCard>
                    <span className="text-emerald-400">
                      {user && user?.data?.user.role == "PATIENT" ? (
                        <>{user?.data?.user.credit} credits</>
                      ) : (
                        <>Pricing</>
                      )}
                    </span>
                  </Badge>
                </Link>
              )}
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                  },
                }}
              />
            </div>
          </SignedIn>
          {/* when user sigend out  */}
          <SignedOut>
            <SignInButton>
              <Button className="cursor-pointer" variant={"secondary"}>
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </nav>
      <Separator className="bg-emerald-400/10" />
    </header>
  );
};

export default Header;
