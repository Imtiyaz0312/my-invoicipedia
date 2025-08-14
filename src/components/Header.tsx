import {
  ClerkProvider,
  OrganizationSwitcher,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import Container from '@/components/Container'
import Link from 'next/link'

const Header = () => {
  return (
    <header className='mt-8 mb-12'>
      <Container>
        <div className='flex justify-between items-center gap-4'>
          <div className='flex items-center gap-4'>
            <p className='font-bold text-2xl'>
              <Link href="/dashboard">Invoicipedia</Link>
            </p>
            <SignedIn>
            <span className='text-slate-500 text-2xl font-bold'>/</span>
              <OrganizationSwitcher 
                afterCreateOrganizationUrl={"/dashboard"}
              />
            </SignedIn>
          </div>
          <div>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </Container>
    </header>
  )
}

export default Header