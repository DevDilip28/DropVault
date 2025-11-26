import SignInForm from "@/components/SignInForm";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex flex-1 items-center justify-center px-4">
        <SignInForm />
      </main>
    </div>
  );
}
