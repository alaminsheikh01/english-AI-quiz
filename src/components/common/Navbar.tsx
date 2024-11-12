import React from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Link from "next/link";
import {
  getKindeServerSession,
  LoginLink,
  LogoutLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { Button, buttonVariants } from "../ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Menu } from "lucide-react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/dashboard" },
];

const Navbar = async () => {
  const { isAuthenticated } = getKindeServerSession();
  const authenticated = await isAuthenticated();

  return (
    <MaxWidthWrapper className="fixed top-0 w-full z-50 right-0 left-0 bg-background/80 backdrop-blur-md shadow-sm">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href={"/"} className="font-bold">
            {" "}
            Learning Platform{" "}
          </Link>
          <div className="hidden md:flex item-center space-x-8">
            {navigation?.map((item) => (
              <Link
                href={item.href}
                key={item.name}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
          {authenticated ? (
            <LogoutLink>Log Out</LogoutLink>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <LoginLink className={buttonVariants({ variant: "ghost" })}>
                Log In
              </LoginLink>
              <RegisterLink
                className={buttonVariants({
                  className:
                    "bg-primary text-primary-foreground hover:bg-primary/90",
                })}
              >
                Sign Up
              </RegisterLink>
            </div>
          )}
        </div>
        <div className="md:hidden">
          <Sheet>
            <SheetTitle className="font-bold">Learning</SheetTitle>
            <SheetTrigger asChild>
              <Button variant={"ghost"} size={"icon"}>
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side={"right"} className="w-[300px] sm:w-[400px]">
              {navigation?.map((item) => (
                <Link
                  href={item?.name}
                  key={item?.href}
                  className="text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-lg hover:bg-accent/10"
                >
                  {item?.name}
                </Link>
              ))}

              <div className="flex flex-col space-y-4 pt-4 border-t border-border">
                <LoginLink
                  className={buttonVariants({
                    variant: "ghost",
                  })}
                >
                  Log In
                </LoginLink>
                <RegisterLink className={buttonVariants({
                    className: "bg-primary text-primary-foreground hover:bg-primary/90",
                })}>Sign Up</RegisterLink>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </MaxWidthWrapper>
  );
};

export default Navbar;
