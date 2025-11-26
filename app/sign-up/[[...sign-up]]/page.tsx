"use client";

import SignUpForm from "@/components/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-50/60 to-white">
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <SignUpForm />
      </main>
    </div>
  );
}
