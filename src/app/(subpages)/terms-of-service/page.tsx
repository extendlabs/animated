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

export default function TermsOfService() {
  const lastUpdated = "December 19, 2024";

  return (
    <div className="mx-auto min-h-screen py-12">
      <main className="container mx-auto max-w-4xl px-4">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl font-bold">
                Terms of Service
              </CardTitle>
              <Badge variant="secondary">Last Updated: {lastUpdated}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6">
              <AlertDescription>
                These terms govern your use of our code animation subscription
                service. By using our service, you agree to these terms and our
                Privacy Policy.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <ScrollArea className="h-full">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-xl font-semibold">
                1. Subscription Terms
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <h3 className="text-lg font-medium">Subscription Plans</h3>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    Various subscription tiers with different feature sets and
                    usage limits
                  </li>
                  <li>
                    Automatic renewal unless cancelled before the billing period
                    ends
                  </li>
                  <li>
                    Pro-rated refunds available within 14 days of subscription
                  </li>
                </ul>

                <h3 className="text-lg font-medium">Usage Limits</h3>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Fair usage policies apply to animation rendering</li>
                  <li>Storage limits vary by subscription tier</li>
                  <li>
                    Additional usage charges may apply for exceeding limits
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-xl font-semibold">
                2. Acceptable Use Policy
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <p>You agree not to:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Share account credentials or transfer subscriptions</li>
                  <li>Use the service for illegal or unauthorized purposes</li>
                  <li>
                    Attempt to reverse engineer or copy our animation technology
                  </li>
                  <li>
                    Upload malicious code or content that violates others&apos;
                    rights
                  </li>
                  <li>
                    Resell or redistribute generated animations without
                    permission
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-xl font-semibold">
                3. Intellectual Property Rights
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <h3 className="text-lg font-medium">Your Content</h3>
                <ul className="list-disc space-y-2 pl-6">
                  <li>You retain rights to your uploaded code and content</li>
                  <li>
                    You grant us license to process and store your content
                  </li>
                  <li>Generated animations are your intellectual property</li>
                </ul>

                <h3 className="text-lg font-medium">Our Service</h3>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    Our animation technology and platform remain our property
                  </li>
                  <li>
                    Service features and UI elements are protected by copyright
                  </li>
                  <li>Usage analytics and aggregated data belong to us</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-xl font-semibold">
                4. Account Management
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <h3 className="text-lg font-medium">Account Security</h3>
                <ul className="list-disc space-y-2 pl-6">
                  <li>You are responsible for maintaining account security</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>Strong passwords and 2FA are recommended</li>
                </ul>

                <h3 className="text-lg font-medium">Account Termination</h3>
                <ul className="list-disc space-y-2 pl-6">
                  <li>We may suspend accounts for terms violations</li>
                  <li>You can cancel your subscription at any time</li>
                  <li>Data retention policies apply after termination</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-xl font-semibold">
                5. Service Modifications
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    We reserve the right to modify or discontinue features
                  </li>
                  <li>Pricing changes will be communicated in advance</li>
                  <li>
                    Service availability and performance are not guaranteed
                  </li>
                  <li>We may update these terms with notice to users</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger className="text-xl font-semibold">
                6. Limitation of Liability
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <p>We are not liable for:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Service interruptions or data loss</li>
                  <li>Accuracy of generated animations</li>
                  <li>Third-party content or integrations</li>
                  <li>Indirect or consequential damages</li>
                  <li>Issues arising from your use of the service</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>

        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="text-sm">
              <p>For questions about these terms, please contact us at:</p>
              <p className="mt-2">legal@yourcompany.com</p>
              <p className="mt-4">Your Company Name</p>
              <p>123 Legal Street</p>
              <p>Tech City, TC 12345</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
