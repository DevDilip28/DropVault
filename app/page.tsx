import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1>Welcome to DropVault</h1>

      <Link href="/sign-up">
        <button>Get Started</button>
      </Link>
    </>
  )
}
