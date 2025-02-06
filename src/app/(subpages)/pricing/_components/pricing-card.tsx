import { Button } from "@/components/ui/button";
import { PRICING_ANIMATION_VARIANTS } from "@/constants/pricing";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { FeatureList } from "./feature-list";
import { PriceDisplay } from "./price-display";
import { type BillingInterval } from "@/types/pricing.type";

type Props = {
  isPopular?: boolean;
  name: string | null;
  description: string | null;
  price: string | number;
  interval: BillingInterval;
  features: string[];
  buttonText: string;
  onButtonClick: () => void;
  buttonDisabled?: boolean;
};

export const PricingCard = ({
  isPopular,
  name,
  description,
  price,
  interval,
  features,
  buttonText,
  onButtonClick,
  buttonDisabled = false,
}: Props) => (
  <div
    className={cn(
      "relative mt-12 flex h-full max-w-sm flex-col pb-2 text-start",
    )}
  >
    {isPopular && (
      <motion.div
        className="absolute -top-7 left-0"
        variants={PRICING_ANIMATION_VARIANTS.badge}
        initial="hidden"
        animate="visible"
      >
        <div className="rounded-l-3xl rounded-r-xl bg-accent px-4 py-1.5 pb-12 pl-6 text-sm font-medium text-white">
          Most Popular
        </div>
      </motion.div>
    )}
    <motion.div
      className={cn(
        "z-10 flex w-full flex-grow flex-col rounded-3xl p-6",
        isPopular
          ? "bg-gradient-to-b from-gray-800 to-gray-900 text-white"
          : "border-4 bg-background",
      )}
      variants={PRICING_ANIMATION_VARIANTS.card}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <p className="text-xl font-medium">{name}</p>
        <p className="my-4 h-12 text-zinc-300">{description}</p>
      </div>
      <PriceDisplay price={price} interval={interval} />
      <FeatureList features={features} />
      <div className="mt-auto">
        <motion.div
          variants={PRICING_ANIMATION_VARIANTS.button}
          initial="hidden"
          animate="visible"
        >
          <Button
            type="button"
            disabled={buttonDisabled}
            onClick={onButtonClick}
            className="w-full"
          >
            {buttonText}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  </div>
);
