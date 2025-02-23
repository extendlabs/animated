"use client";

import Card from "@/components/card";
import { Button } from "@/components/ui/button";
import { handleRequest } from "@/lib/auth-helpers/client";
import { updateEmail } from "@/lib/auth-helpers/server";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  userEmail?: string;
};

export const EmailForm = ({ userEmail }: Props) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    if (e.currentTarget.newEmail.value === userEmail) {
      e.preventDefault();
      setIsSubmitting(false);
      return;
    }
    handleRequest(e, updateEmail, router);
    setIsSubmitting(false);
  };

  return (
    <Card
      title="Your Email"
      description="Please enter the email address you want to use to login."
      footer={
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <p className="pb-4 sm:pb-0">
            We will email you to verify the change.
          </p>
          <Button type="submit" form="emailForm" loading={isSubmitting}>
            Update Email
          </Button>
        </div>
      }
    >
      <div className="mb-4 mt-8 text-xl font-medium">
        <form id="emailForm" onSubmit={(e) => handleSubmit(e)}>
          <input
            type="text"
            name="newEmail"
            className="w-full rounded-md bg-zinc-800 p-3 sm:w-1/2"
            defaultValue={userEmail ?? ""}
            placeholder="Your email"
            maxLength={64}
          />
        </form>
      </div>
    </Card>
  );
};
