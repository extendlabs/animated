import { type BillingInterval } from "@/types/pricing.type";
import React, { useEffect, useState } from "react";

type Props = {
  price: string | number;
  interval: BillingInterval;
};

const AnimatedPrice = ({ price, interval }: Props) => {
  const [count, setCount] = useState(0);
  const targetPrice =
    typeof price === "string"
      ? parseFloat(price.replace(/[^0-9.-]+/g, ""))
      : price;

  useEffect(() => {
    let current = count;
    const step = (targetPrice - count) / 15;
    const increment = step > 0 ? Math.ceil(step) : Math.floor(step);

    const timer = setInterval(() => {
      if (current !== targetPrice) {
        current =
          Math.abs(targetPrice - current) < Math.abs(increment)
            ? targetPrice
            : current + increment;
        setCount(current);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [targetPrice, count]);

  const renderInterval = () => {
    if (interval === "lifetime") {
      return <span className="text-lg text-gray-400">one-time</span>;
    }
    return <span className="text-lg text-gray-400">/{interval}</span>;
  };

  return (
    <div className="mb-6 inline-flex items-baseline">
      <span className="text-4xl font-bold">$</span>
      <span className="mx-1 text-4xl font-bold tabular-nums">
        {Math.round(count)}
      </span>
      {renderInterval()}
    </div>
  );
};

export default AnimatedPrice;
