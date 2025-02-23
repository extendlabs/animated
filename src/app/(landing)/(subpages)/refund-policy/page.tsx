import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export default function RefundPolicy() {
  const lastUpdated = "January 19, 2025";

  return (
    <div className="mx-auto min-h-screen py-12">
      <main className="container mx-auto max-w-4xl px-4">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl font-bold">
                Refund Policy
              </CardTitle>
              <Badge variant="secondary">Last Updated: {lastUpdated}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6">
              <AlertDescription>
                We strive to provide the best code animation service possible.
                If you&apos;re not satisfied, we offer refunds according to the
                terms below.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <ScrollArea className="h-full">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-xl font-semibold">
                1. Subscription Refund Terms
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <h3 className="text-lg font-medium">30-Day Subscriptions</h3>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    Full refund available within the first 14 days of initial
                    subscription.
                  </li>
                  <li>
                    No refunds for partial month usage after the first 14 days.
                  </li>
                  <li>
                    No prorated refunds if canceled after the first 14 days.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-xl font-semibold">
                2. Refund Eligibility
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <h3 className="text-lg font-medium">Eligible Scenarios</h3>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Service unavailability exceeding 24 hours</li>
                  <li>
                    Major feature unavailability affecting core functionality
                  </li>
                  <li>Technical issues preventing animation generation</li>
                  <li>Billing errors or unauthorized charges</li>
                </ul>

                <h3 className="text-lg font-medium">Non-Eligible Scenarios</h3>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Change of mind after the 14-day period</li>
                  <li>Unused features or services</li>
                  <li>Minor service interruptions</li>
                  <li>Violation of Terms of Service</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-xl font-semibold">
                3. Refund Process
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <h3 className="text-lg font-medium">How to Request</h3>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Refund requests can only be made via email.</li>
                  <li>
                    Send an email to <strong>billing@extendui.com</strong>
                  </li>
                  <li>
                    Include your subscription details and reason for the refund
                    request.
                  </li>
                  <li>Provide relevant error screenshots if applicable.</li>
                </ul>

                <h3 className="text-lg font-medium">Processing Timeline</h3>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Initial response within 24 hours</li>
                  <li>Review process takes 1-3 business days</li>
                  <li>
                    Refund processed within 5-7 business days after approval
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-xl font-semibold">
                4. Payment Methods
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <ul className="list-disc space-y-2 pl-6">
                  <li>Refunds are processed to the original payment method.</li>
                  <li>
                    Credit card refunds typically appear within 5-10 business
                    days.
                  </li>
                  <li>
                    PayPal refunds typically appear within 1-3 business days.
                  </li>
                  <li>Bank transfer refunds may take 7-14 business days.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-xl font-semibold">
                5. Stripe Fees
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    The Stripe processing fee is not refundable. In the event of
                    a refund, Stripe will retain the fee they initially charged.
                  </li>
                  <li>
                    For example, if you paid $100 and Stripe took a $2 fee, you
                    will receive a refund of $100, but the $2 fee will not be
                    returned.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger className="text-xl font-semibold">
                6. Data Retention
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <p>After refund processing:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Generated animations remain accessible for 7 days.</li>
                  <li>Download your content before account closure.</li>
                  <li>
                    Account settings and preferences are retained for 30 days.
                  </li>
                  <li>Usage history is maintained for compliance purposes.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>

        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="space-y-4 text-center">
              <p className="text-lg font-medium">Need to request a refund?</p>
            </div>
            <div className="mt-6 text-sm">
              <p>For refund-related questions, contact us at:</p>
              <p className="mt-2">billing@extendui.com</p>
              <p className="mt-4">Krzysztof Wicki App Developer</p>
              <p>Antoniego Suchanka 11/8</p>
              <p>Gdańsk, 80-772</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
