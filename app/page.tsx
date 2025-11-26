"use client";

import { Button } from "@heroui/button";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { Card, CardBody } from "@heroui/card";
import {
  Upload,
  Lock,
  FolderOpen,
  HardDrive,
  FileText,
  Check,
  Github,
  Linkedin,
} from "lucide-react";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        <section className="py-20 md:py-28 px-4 md:px-6 bg-white">
          <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

            <div className="space-y-6 text-center lg:text-left max-w-xl mx-auto lg:mx-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Your files, secured.
                <br />
                <span className="text-indigo-600">
                  Private. Organized. Always yours.
                </span>
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed">
                Store documents, photos, and videos in your private encrypted vault.
                Keep everything safe, synced, and accessible — anytime, anywhere.
              </p>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
                <SignedOut>
                  <Link href="/sign-up">
                    <Button
                      size="lg"
                      className="
                        bg-indigo-600 text-white 
                        font-semibold px-8 py-3 
                        rounded-lg hover:bg-indigo-700
                        shadow-md hover:shadow-lg 
                        transition-shadow
                      "
                    >
                      Start Free
                    </Button>
                  </Link>

                  <Link href="/sign-in">
                    <Button
                      size="lg"
                      className="
                        text-indigo-600 font-semibold 
                        px-8 py-3 rounded-lg 
                        border border-indigo-200 
                        hover:bg-indigo-50
                      "
                    >
                      Sign In
                    </Button>
                  </Link>
                </SignedOut>

                <SignedIn>
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="
                        bg-indigo-600 text-white 
                        font-semibold px-8 py-3 
                        rounded-lg hover:bg-indigo-700 
                        shadow-md hover:shadow-lg 
                        transition-shadow
                      "
                    >
                      Open Vault
                    </Button>
                  </Link>
                </SignedIn>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative w-72 h-72 md:w-96 md:h-96 group">

                <div
                  className="
                    bg-gradient-to-br from-gray-50 to-gray-100 
                    border border-gray-200/70 rounded-3xl p-6
                    shadow-[0_6px_20px_rgba(0,0,0,0.06)]
                    w-full h-full flex flex-col justify-between 
                    transition-all duration-300
                    group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)]
                    group-hover:-translate-y-1
                  "
                >

                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-indigo-100">
                      <HardDrive className="h-5 w-5 text-indigo-600" />
                    </div>
                    <span className="font-semibold text-gray-900 text-sm tracking-wide">
                      My Vault
                    </span>
                  </div>

                  <div className="space-y-4 mt-4">

                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">report.pdf</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <FolderOpen className="h-4 w-4 text-indigo-600" />
                      <span className="text-sm font-medium text-indigo-600">Projects</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">photo.jpg</span>
                    </div>

                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-emerald-600" />
                      <span className="text-xs text-emerald-600">Encrypted</span>
                    </div>

                    <button className="p-2 rounded-full hover:bg-gray-200 transition">
                      <Upload className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>

                </div>
              </div>
            </div>


          </div>
        </section>

        <section className="py-20 px-4 md:px-6 bg-white">
          <div className="container mx-auto">

            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-gray-900">
                Everything you need in one vault
              </h2>
              <p className="text-gray-500 mt-3 max-w-lg mx-auto">
                Built for creators, students, and professionals who value simplicity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">

              <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardBody className="p-7 text-center">
                  <FolderOpen className="h-12 w-12 mx-auto mb-5 text-indigo-600" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Full File Hierarchy
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Create folders, manage structure, and stay organized effortlessly.
                  </p>
                </CardBody>
              </Card>

              <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardBody className="p-7 text-center">
                  <Lock className="h-12 w-12 mx-auto mb-5 text-emerald-600" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Private by Default
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Your files are encrypted and fully private.
                  </p>
                </CardBody>
              </Card>

              <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardBody className="p-7 text-center">
                  <Upload className="h-12 w-12 mx-auto mb-5 text-amber-500" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Upload Anything
                  </h3>
                  <p className="text-gray-600 text-sm">
                    PDFs, images, ZIPs, videos—store anything you need.
                  </p>
                </CardBody>
              </Card>

            </div>
          </div>
        </section>

        <section className="py-20 px-4 md:px-6 bg-white text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Ready to own your files?
          </h2>
          <p className="text-gray-600 mt-2 max-w-lg mx-auto">
            Join thousands who trust DropVault with their digital life.
          </p>

          <div className="mt-8">
            <SignedOut>
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="
                    bg-indigo-600 text-white 
                    font-semibold px-8 py-3 
                    rounded-lg hover:bg-indigo-700 
                    shadow-md hover:shadow-lg 
                    transition-shadow
                  "
                >
                  Create Your Vault — Free
                </Button>
              </Link>
            </SignedOut>

            <SignedIn>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="
                    bg-indigo-600 text-white 
                    font-semibold px-8 py-3 
                    rounded-lg hover:bg-indigo-700 
                    shadow-md hover:shadow-lg 
                    transition-shadow
                  "
                >
                  Go to Dashboard
                </Button>
              </Link>
            </SignedIn>
          </div>
        </section>

      </main>

      <footer className="bg-white border-t border-gray-200 py-6">

        <div className="container mx-auto flex flex-col md:flex-row 
      items-center justify-between gap-4 text-gray-600 text-sm">

          <div className="flex items-center gap-1">
            © {new Date().getFullYear()} DropVault —
            <span className="font-medium">All rights reserved.</span>
          </div>

          <div>
            Developed by{" "}
            <span className="font-semibold text-indigo-500 hover:text-indigo-600 transition-colors">
              Dilip
            </span>
          </div>

          <div className="flex items-center gap-5 text-gray-400">
            <a
              href="https://github.com/DevDilip28"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hover:text-indigo-500 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>

            <a
              href="http://www.linkedin.com/in/dilipasdeo"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-indigo-500 transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>

        </div>
      </footer>

    </div>
  );
}
