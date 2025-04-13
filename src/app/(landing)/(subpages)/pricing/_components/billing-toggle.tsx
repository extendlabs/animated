import React from "react";
import { Switch } from "@/components/ui/switch";
import { type BillingInterval } from "@/types/pricing.type";

type Props = {
  billingInterval: BillingInterval;
  onChange: (value: BillingInterval) => void;
};

export const BillingToggle = ({ billingInterval, onChange }: Props) => {
  if (billingInterval === "lifetime") return null;

  return (
    <div className="mb-6 mt-12 flex w-full justify-center">
      <div className="inline-flex items-center gap-4">
        <span
          className={`w-36 cursor-pointer text-right text-base ${billingInterval === "month" ? "text-white" : "text-zinc-500"}`}
          onClick={() => onChange("month")}
        >
          Monthly
        </span>
        <Switch
          checked={billingInterval === "year"}
          onCheckedChange={(checked) => onChange(checked ? "year" : "month")}
          className="bg-zinc-700 data-[state=checked]:bg-accent"
        />
        <div className="flex w-36 items-center gap-2">
          <span
            className={`cursor-pointer text-base ${billingInterval === "year" ? "text-white" : "text-zinc-500"}`}
            onClick={() => onChange("year")}
          >
            Yearly
          </span>
          <span className="rounded-full bg-emerald-900/50 px-3 py-1 text-sm text-emerald-400">
            Save 20%
          </span>
        </div>
      </div>
    </div>
  );
};
