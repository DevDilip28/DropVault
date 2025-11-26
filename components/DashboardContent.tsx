"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import UploadFile from "@/components/UploadFile";
import UserProfile from "@/components/UserProfile";
import FileList from "@/components/FileList";
import { FileText, Upload, User, HardDrive } from "lucide-react";

export default function DashboardContent({ userId, userName }) {
  const [activePage, setActivePage] = useState("files");

  return (
    <div className="min-h-screen flex bg-gray-50">

      <nav
        className="
          lg:hidden fixed top-0 left-0 w-full z-50
          bg-white border-b shadow-sm
          flex items-center justify-between
          px-3 py-2
        "
      >
        <div className="flex items-center gap-2">
          <HardDrive className="h-5 w-5 text-indigo-600" />
          <h2 className="font-semibold text-sm text-gray-900">DropVault</h2>
        </div>

        <div className="flex items-center gap-3">
          {[
            { key: "files", icon: FileText },
            { key: "upload", icon: Upload },
            { key: "profile", icon: User },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setActivePage(item.key)}
              className={`p-1.5 rounded-md transition ${activePage === item.key
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-600"
                }`}
            >
              <item.icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      </nav>

      <div className="hidden lg:block">
        <Sidebar active={activePage} setActive={setActivePage} />
      </div>

      <main
        className="
          flex-1 p-6
          pt-20      
          lg:pt-10   
        "
      >
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Welcome,{" "}
            <span className="text-indigo-600">
              {userName?.split(" ")[0] || "User"}
            </span>
          </h1>

          <p className="text-gray-500 text-lg mt-1">
            Manage your files, upload new content, and update your profile.
          </p>
        </div>

        {activePage === "files" && (
          <div
            className="
              bg-white p-8 rounded-2xl 
              shadow-[0_4px_16px_rgba(0,0,0,0.06)]
              border border-gray-200
            "
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your Files
            </h2>

            <p className="text-gray-500 mb-4">
              View, download, and manage your stored files.
            </p>

            <FileList userId={userId} />
          </div>
        )}

        {activePage === "upload" && (
          <div
            className="
              bg-white p-8 rounded-2xl max-w-xl
              shadow-[0_4px_16px_rgba(0,0,0,0.06)]
              border border-gray-200
            "
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Upload Files
            </h2>

            <p className="text-gray-500 mb-4">
              Upload documents, images, and more to your secure vault.
            </p>

            <UploadFile userId={userId} parentId={null} />
          </div>
        )}

        {activePage === "profile" && (
          <div className="max-w-xl">
            <UserProfile />
          </div>
        )}
      </main>
    </div>
  );
}
