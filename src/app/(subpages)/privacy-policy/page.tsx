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
  const lastUpdated = "December 19, 2024";

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
                This privacy policy applies to all users of our code animation
                subscription service. We are committed to protecting your
                privacy and handling your data transparently.
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
                  <li>Billing information for subscription processing</li>
                  <li>Usage patterns of our animation features</li>
                </ul>

                <h3 className="text-lg font-medium">Technical Data</h3>
                <ul className="list-disc space-y-2 pl-6">
                  <li>IP address and device information</li>
                  <li>Browser type and operating system</li>
                  <li>Time zone and language preferences</li>
                </ul>

                <h3 className="text-lg font-medium">Content Data</h3>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Code snippets uploaded for animation</li>
                  <li>Generated animations and related metadata</li>
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
                  <li>Processing and storing your code animations</li>
                  <li>Managing your subscription and payments</li>
                  <li>Providing customer support and service updates</li>
                </ul>

                <h3 className="text-lg font-medium">Service Improvement</h3>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Analyzing usage patterns to improve features</li>
                  <li>Debugging and optimizing performance</li>
                  <li>Personalizing your experience</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-xl font-semibold">
                3. Subscription Data Handling
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <p>
                  We process subscription-related data through secure payment
                  processors. Your payment information is never stored directly
                  on our servers.
                </p>

                <h3 className="text-lg font-medium">
                  Subscription Information We Store
                </h3>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Subscription tier and status</li>
                  <li>Subscription history and usage metrics</li>
                  <li>Billing cycle information</li>
                </ul>

                <h3 className="text-lg font-medium">Payment Processing</h3>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    All payments are processed through secure third-party
                    providers
                  </li>
                  <li>We maintain industry-standard security practices</li>
                  <li>Subscription data is encrypted in transit and at rest</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-xl font-semibold">
                4. Data Retention & Deletion
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <h3 className="text-lg font-medium">Active Subscriptions</h3>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    Your data is retained while your subscription is active
                  </li>
                  <li>
                    Generated animations are stored securely in your account
                  </li>
                  <li>You can delete your content at any time</li>
                </ul>

                <h3 className="text-lg font-medium">After Cancellation</h3>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    Account data is retained for 30 days after cancellation
                  </li>
                  <li>Generated animations are archived for 30 days</li>
                  <li>You can request complete data deletion at any time</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-xl font-semibold">
                5. Your Rights & Controls
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <p>You have the right to:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Access your personal data and animation history</li>
                  <li>Export your data in a machine-readable format</li>
                  <li>Request corrections to your account information</li>
                  <li>Delete your account and associated data</li>
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
              <p className="mt-2">privacy@yourcompany.com</p>
              <p className="mt-4">Your Company Name</p>
              <p>123 Privacy Street</p>
              <p>Tech City, TC 12345</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
