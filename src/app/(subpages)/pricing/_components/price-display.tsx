import { type BillingInterval } from "@/types/pricing.type";

type Props = {
  price: string | number;
  interval: BillingInterval;
};

export const PriceDisplay = ({ price, interval }: Props) => (
  <div className="mb-6">
    <div className="flex items-baseline">
      <span className="text-4xl font-bold">
        {typeof price === "number" ? `$${price}` : price}
      </span>
      <span className="ml-2 text-lg text-gray-400">/{interval}</span>
    </div>
  </div>
);
