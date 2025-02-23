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

export default function PrivacyPolicy() {
  const lastUpdated = "January 19, 2025";

  return (
    <div className="mx-auto min-h-screen py-12">
      <main className="container mx-auto max-w-4xl px-4">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl font-bold">
                Privacy Policy
              </CardTitle>
              <Badge variant="secondary">Last Updated: {lastUpdated}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6">
              <AlertDescription>
                This privacy policy applies to users of the &quot;Animated&quot;
                code animation app, created by ExtendUI. We are committed to
                protecting your privacy and handling your data responsibly and
                transparently.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <ScrollArea className="h-full">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-xl font-semibold">
                1. Information We Collect
              </AccordionTrigger>
              <AccordionContent className="space-y-">
                <h3 className="text-lg font-medium">Account Information</h3>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Email address and password for account creation</li>
                  <li>
                    Subscription information for payment processing via Stripe
                  </li>
                </ul>

                <h3 className="text-lg font-medium">Content Data</h3>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Code snippets uploaded for animation</li>
                  <li>Generated animations and associated metadata</li>
                  <li>Custom settings and preferences</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-xl font-semibold">
                2. How We Use Your Data
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <h3 className="text-lg font-medium">Service Provision</h3>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Creating and managing your animation content</li>
                  <li>
                    Managing your subscription and payments through Stripe
                  </li>
                  <li>Providing customer support and service updates</li>
                </ul>

                <h3 className="text-lg font-medium">Service Improvement</h3>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Improving user experience based on usage patterns</li>
                  <li>Debugging and optimizing app performance</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-xl font-semibold">
                3. Subscription Data Handling
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <p>
                  Payments and subscriptions are processed securely through
                  Stripe. We do not store payment information. We only collect
                  the necessary subscription-related data.
                </p>

                <h3 className="text-lg font-medium">
                  Subscription Information We Store
                </h3>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Subscription type and status</li>
                  <li>Subscription history and usage metrics</li>
                  <li>Billing cycle and payment history</li>
                </ul>

                <h3 className="text-lg font-medium">Payment Processing</h3>
                <ul className="list-disc space-y-2 pl-6">
                  <li>All payment processing is handled by Stripe</li>
                  <li>
                    We do not store your credit card or payment information
                  </li>
                  <li>Stripe ensures all payment data is processed securely</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-xl font-semibold">
                4. Data Retention & Deletion
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <h3 className="text-lg font-medium">Data Retention</h3>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    Your data is retained while your subscription is active
                  </li>
                  <li>Generated animations are stored in your account</li>
                </ul>

                <h3 className="text-lg font-medium">After Cancellation</h3>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    Account and content data is retained for 30 days after
                    cancellation
                  </li>
                  <li>Animations are archived for 30 days before deletion</li>
                  <li>You can request complete data deletion at any time</li>
                </ul>

                <h3 className="text-lg font-medium">Content Deletion</h3>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    You may delete your account and associated data at any time
                  </li>
                  <li>Deleted content cannot be recovered</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-xl font-semibold">
                5. Your Rights & Controls
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <p>
                  You have the following rights regarding your personal data:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    Access your account data, including email, animations, and
                    settings
                  </li>
                  <li>Export your data in a machine-readable format</li>
                  <li>Request corrections to your account information</li>
                  <li>
                    Delete your account and all associated data at any time
                  </li>
                  <li>
                    Request the deletion of your animations after cancellation
                  </li>
                  <li>Opt-out of non-essential communications</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>

        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="text-sm">
              <p>
                For any privacy-related questions or concerns, please contact us
                at:
              </p>
              <p className="mt-2">privacy@extendui.com</p>
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
