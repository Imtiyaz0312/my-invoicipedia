import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center text-center gap-6 max-w-5xl mx-auto">
      <h1 className="text-5xl font-bold">Invoicipedia</h1>
      <div className='flex justify-center items-center gap-6'>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <Button asChild>
          <a href="/dashboard">Sign In</a>
        </Button>
      </div>

    </main>
  );
}
