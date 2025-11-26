"use client";

import { FileText, Upload, User, HardDrive } from "lucide-react";

export default function Sidebar({ active, setActive }) {
  return (
    <>
      <aside className="hidden lg:flex w-64 h-screen border-r bg-white p-6 flex-col">

        <div className="flex items-center gap-3 mb-10">
          <div className="h-10 w-10 bg-indigo-100 flex items-center justify-center rounded-xl">
            <HardDrive className="h-5 w-5 text-indigo-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">DropVault</h2>
        </div>

        <nav className="space-y-2">
          {[
            { key: "files", label: "My Files", icon: FileText },
            { key: "upload", label: "Upload", icon: Upload },
            { key: "profile", label: "Profile", icon: User },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className={`flex items-center gap-3 w-full p-3 rounded-lg transition
                ${active === item.key
                  ? "bg-indigo-50 text-indigo-600 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
      <nav className="lg:hidden fixed top-0 left-0 w-full z-50 
        bg-white border-b shadow-sm 
        flex items-center justify-between 
        px-3 py-2">

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
              onClick={() => setActive(item.key)}
              className={`p-1.5 rounded-md transition ${active === item.key
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-600"
                }`}
            >
              <item.icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
