
import Container from "@/components/Container";
import { Badge } from "@/components/ui/badge";
import { Customers, Invoices } from "@/db/schema";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Check, CreditCard, DollarSign, X } from "lucide-react";
import createPayment from "@/app/actions";
import Stripe from "stripe";
import React from "react";
import PaymentUpdater from "@/components/PaymentUpdater";

interface InvoicePageProps {
    params: { invoiceId: string },
    searchParams: {
        status: string;
        sessionId: string;
    }
}

const stripe = new Stripe(String(process.env.STRIPE_API_SECRET))


export default async function Invoice({ params, searchParams }: InvoicePageProps) {
    const invoiceId = parseInt((await params).invoiceId)
    const { sessionId, status } = await searchParams
    const isSuccess = (sessionId && status === 'success')
    const isCanceled = status === 'canceled'
    let isError = (isSuccess && !sessionId)

    if (isNaN(invoiceId)) {
        throw new Error('Invalid Invoice Id')
    }

    // if (isSuccess) {
    //     const { payment_status } = await stripe.checkout.sessions.retrieve(sessionId)
    //     if (payment_status !== 'paid') {
    //         isError = true
    //     } else {
    //         const formData = new FormData()
    //         formData.append('id', String(invoiceId))
    //         formData.append('status', 'paid')
    //         await updateStatusAction(formData)
    //     }

    // }
    
    
    const [result] = await db.select({
        id: Invoices.id,
        status: Invoices.status,
        createTs: Invoices.createTs,
        description: Invoices.description,
        value: Invoices.value,
        name: Customers.name,
    })
    .from(Invoices)
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    .where(eq(Invoices.id, invoiceId))
    .limit(1)
    
    
    
    if (!result)
        notFound();
    
    const invoice = {
        ...result,
        customer: {
            name: result.name
        }
    }
    
    return (
        <main className="h-full">
            <Container>
            {
                isSuccess && (
                    <PaymentUpdater
                        invoiceId={invoiceId}
                        sessionId={sessionId}
                        status={status}
                    />
                )
            }
                {isError && (
                    <p className="bg-red-100 text-sm text-red-800 px-3 py-2 rounded-lg mb-6 text-center mx-4">
                        Something Went Wrong, Please Try Again!
                    </p>
                )}
                {isCanceled && (
                    <p className="bg-yellow-100 text-sm text-red-800 px-3 py-2 rounded-lg mb-6 text-center mx-4">
                        Payment was Canceled, Please Try Again!
                    </p>
                )}
                <div className="grid grid-cols-2">
                    <div>
                        <div className="flex justify-between mb-8">
                            <h1 className="flex items-center gap-4 text-3xl font-semibold">
                                Invoices {invoice.id}
                                <Badge className={cn(
                                    "rounded-full capitalize px-4 py-1 font-semibold",
                                    invoice.status === 'open' && 'bg-blue-500',
                                    invoice.status === 'paid' && 'bg-green-600',
                                    invoice.status === 'void' && 'bg-gray-500',
                                    invoice.status === 'uncollectible' && 'bg-red-600',
                                )}>
                                    {invoice.status}
                                </Badge>
                            </h1>
                        </div>

                        <p className="text-3xl mb-3">
                            ${(invoice.value / 100).toFixed(2)}
                        </p>

                        <p className="text-lg mb-8">
                            {invoice.description}
                        </p>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold mb-4">Manage Invoice</h2>
                        {invoice.status === 'open' && (
                            <form action={createPayment}>
                                <input type="hidden" name="id" value={invoice.id} />
                                <Button className="flex gap-2 font-bold bg-green-700">
                                    <CreditCard className="w-5 h-auto" />
                                    Pay Invoice
                                </Button>
                            </form>
                        )}
                        {invoice.status === 'paid' && (
                            <p className="flex gap-2 items-center text-xl font-bold">
                                <Check className="w-8 h-auto bg-green-600 rounded-full text-white p-1" />
                                Invoice Paid
                            </p>
                        )}
                        {invoice.status === 'void' && (
                            <p className="flex gap-2 items-center text-lg font-semibold">
                                <X className="w-8 h-auto bg-slate-500 rounded-full text-white p-1" />
                                This is invoice is no longer valid.
                            </p>
                        )}
                        {invoice.status === 'uncollectible' && (
                            <p className="flex gap-2 items-center text-md font-semibold">
                                <DollarSign className="w-8 h-auto p-1" />
                                This invoice amount is uncollectible.
                            </p>
                        )}
                    </div>

                </div>
                <h2 className="font-bold text-lg mb-4">
                    Billing Details
                </h2>

                <ul className="grid gap-4">
                    <li className="flex gap-4">
                        <strong className="block w-28 flex-shrink-0 font-medium text-sm">Invoice ID</strong>
                        <span>{invoice.id}</span>
                    </li>
                    <li className="flex gap-4">
                        <strong className="block w-28 flex-shrink-0 font-medium text-sm">Invoice Date</strong>
                        <span>{new Date(invoice.createTs).toLocaleDateString('en-GB')}</span>
                    </li>
                    <li className="flex gap-4">
                        <strong className="block w-28 flex-shrink-0 font-medium text-sm">Billing Name</strong>
                        <span>{invoice.customer.name}</span>
                    </li>
                </ul>
            </Container>
        </main>
    );
}
