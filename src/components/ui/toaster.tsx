/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function Toaster() {
  const { toast, toasts } = useToast();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const status = searchParams.get("status");
    const status_description = searchParams.get("status_description");
    const error = searchParams.get("error");
    const error_description = searchParams.get("error_description");
    if (error || status) {
      toast({
        title: error
          ? (error ?? "Hmm... Something went wrong.")
          : (status ?? "Alright!"),
        description: error ? error_description : status_description,
        variant: error ? "destructive" : undefined,
      });
      const newSearchParams = new URLSearchParams(searchParams.toString());
      const paramsToRemove = [
        "error",
        "status",
        "status_description",
        "error_description",
      ];
      paramsToRemove.forEach((param) => newSearchParams.delete(param));
      const redirectPath = `${pathname}?${newSearchParams.toString()}`;
      router.replace(redirectPath, { scroll: false });
    }
  }, [searchParams]);

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast
            key={id}
            {...props}
            className="rounded-lg border border-sidebar-border bg-sidebar p-4 text-white shadow-lg"
          >
            <div className="grid gap-1 text-white">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="text-white hover:text-zinc-50" />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
