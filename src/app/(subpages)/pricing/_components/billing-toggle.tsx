import React from 'react';
import { Switch } from "@/components/ui/switch";
import { BillingInterval } from '@/types/pricing.type';

type Props = {
    billingInterval: BillingInterval;
    onChange: (value: BillingInterval) => void;
}

const BillingToggle = ({ billingInterval, onChange }: Props) => {
    return (
        <div className="w-full flex justify-center mt-12 mb-6">
            <div className="inline-flex items-center gap-4">
                <span
                    className={`text-base cursor-pointer w-36 text-right ${billingInterval === 'month' ? 'text-white' : 'text-zinc-500'}`}
                    onClick={() => onChange('month')}
                >
                    Monthly
                </span>
                <Switch
                    checked={billingInterval === 'year'}
                    onCheckedChange={(checked) => onChange(checked ? 'year' : 'month')}
                    className="data-[state=checked]:bg-accent bg-zinc-700"
                />
                <div className="flex items-center gap-2 w-36">
                    <span
                        className={`text-base cursor-pointer ${billingInterval === 'year' ? 'text-white' : 'text-zinc-500'}`}
                        onClick={() => onChange('year')}
                    >
                        Yearly
                    </span>
                    <span className="bg-emerald-900/50 text-emerald-400 rounded-full px-3 py-1 text-sm">
                        Save 20%
                    </span>
                </div>
            </div>
        </div>
    );
};

export default BillingToggle;