"use client";

import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import * as React from "react";

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <Button
      onClick={() => {
        if (resolvedTheme === "light") {
          setTheme("dark");
        } else if (resolvedTheme === "dark") {
          setTheme("light");
        }
      }}
      variant="outline"
      size="icon"
      className="fixed m-4 bottom-0 md:bottom-[30px] right-0 print:hidden z-30"
    >
      <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
    // <DropdownMenu>
    //   <DropdownMenuTrigger asChild>
    //     <Button
    //       onClick={() => {
    //         if (theme === "light") {
    //           setTheme("dark");
    //         } else if (theme === "dark") {
    //           setTheme("light");
    //         }
    //
    //       }}
    //       variant="outline"
    //       size="icon"
    //       className="fixed m-4 bottom-0 md:bottom-[30px] right-0 print:hidden"
    //     >
    //       <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
    //       <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    //       <span className="sr-only">Toggle theme</span>
    //     </Button>
    //   </DropdownMenuTrigger>
    //   <DropdownMenuContent align="end">
    //     <DropdownMenuItem onClick={() => setTheme("light")}>
    //       Light
    //     </DropdownMenuItem>
    //     <DropdownMenuItem onClick={() => setTheme("dark")}>
    //       Dark
    //     </DropdownMenuItem>
    //     <DropdownMenuItem onClick={() => setTheme("system")}>
    //       System
    //     </DropdownMenuItem>
    //   </DropdownMenuContent>
    // </DropdownMenu>
  );
}
