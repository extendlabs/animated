"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import Card from "@/components/card";
import { format } from "date-fns";
import { Download, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { toast, useToast } from '@/hooks/use-toast';

interface Invoice {
    id: string;
    amount_paid: number;
    currency: string;
    status: string;
    created: number;
    invoice_pdf: string;
    invoice_url: string;
}

export default function InvoicesForm() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const fetchInvoices = async () => {
        if (invoices.length > 0) {
            setIsExpanded(!isExpanded);
            return;
        }

        try {
            setLoading(true);
            const response = await fetch('/api/get-invoices');
            console.log(response)
            const data = await response?.json();

            if (data.success) {
                setInvoices(data.invoices);
                setIsExpanded(true);
            } else {
                console.log(data.error)
                toast({
                    title: "Error",
                    description: data.error,
                    variant: "destructive",
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load invoices",
                variant: "destructive",
            })

        } finally {
            setLoading(false);
        }
    };

    return (
        <Card
            title="Billing History"
            description="View your past invoices and download receipts."
            footer={
                <div className="flex justify-end">
                    <Button
                        variant="outline"
                        onClick={fetchInvoices}
                        className="flex items-center gap-2 text-primary"
                        disabled={loading}
                    >
                        {loading ? (
                            'Loading...'
                        ) : (
                            <>
                                {isExpanded ? 'Hide' : 'Show'} Invoices
                                {isExpanded ? (
                                    <ChevronUp className="h-4 w-4" />
                                ) : (
                                    <ChevronDown className="h-4 w-4" />
                                )}
                            </>
                        )}
                    </Button>
                </div>
            }
        >
            <div className="mt-4">
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="space-y-4">
                        {invoices.length === 0 ? (
                            <p className="text-zinc-300">No invoices found.</p>
                        ) : (
                            invoices.map((invoice) => (
                                <div
                                    key={invoice.id}
                                    className="flex items-center justify-between pb-4 border-b border-zinc-800 last:border-none"
                                >
                                    <div>
                                        <p className="text-sm text-zinc-300">
                                            {format(new Date(invoice.created * 1000), "MMMM d, yyyy")}
                                        </p>
                                        <p className="text-sm text-zinc-300">
                                            {new Intl.NumberFormat('en-US', {
                                                style: 'currency',
                                                currency: invoice.currency
                                            }).format(invoice.amount_paid / 100)}
                                        </p>
                                        <p className="text-xs text-zinc-400">
                                            Status: {invoice.status}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size={'icon'}
                                            onClick={() => window.open(invoice.invoice_url, '_blank')}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size={'icon'}
                                            onClick={() => window.open(invoice.invoice_pdf, '_blank')}
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}