import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

//Only home page is available for public
const isPublic = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/invoices/(.*)/payment',
])

export default clerkMiddleware(async (auth, request) => {
  if ( !isPublic(request) ) {
    await auth.protect()
  }
});

//protect individual pages

// const isProtected = createRouteMatcher([
//   '/dashboard',
//   '/invoices/:invoiceId',
//   '/invoices/new'
// ])

// export default clerkMiddleware(async (auth, request) => {
//   if (isProtected(request)) {
//     await auth.protect()
//   }
// });

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};