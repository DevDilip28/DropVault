"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Navbar as HeroNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <HeroNavbar
      maxWidth="full"
      isBlurred={false}
      className={`
        fixed top-0 z-50 w-full 
        h-16 sm:h-20 px-5 sm:px-8
        flex items-center
        transition-all duration-300 ease-out

        ${scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
          : "bg-white/50 backdrop-blur-2xl shadow-none"
        }
      `}
    >

      <NavbarBrand className="gap-3">
        <Image
          src="/logo.png"
          alt="DropVault"
          width={42}
          height={42}
          className="rounded-md"
        />
        <span className="font-semibold text-[20px] sm:text-[22px] text-black tracking-tight">
          DropVault
        </span>
      </NavbarBrand>

      <NavbarContent justify="center" className="hidden sm:flex">
        <NavbarItem>
          <Link
            href="/"
            className="text-[17px] font-medium text-indigo-600 tracking-tight"
          >
            Home
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Link
            href="/sign-up"
            className="text-[17px] font-semibold text-black tracking-tight"
          >
            Get start
          </Link>
        </NavbarItem>
      </NavbarContent>
    </HeroNavbar>
  );
}
