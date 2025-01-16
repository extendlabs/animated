import { PRICING_ANIMATION_VARIANTS } from "@/constants/pricing";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

type Props = {
    features: string[]
}

export const FeatureList = ({ features }: Props) => (
    <ul className="space-y-3 flex-grow">
        {features.map((feature, index) => (
            <motion.li
                key={index}
                className="flex items-start space-x-3"
                custom={index}
                variants={PRICING_ANIMATION_VARIANTS.feature}
                initial="hidden"
                animate="visible"
            >
                <motion.span
                    className="flex h-5 w-5 flex-shrink-0 items-center justify-center mt-0.5"
                    custom={index}
                    variants={PRICING_ANIMATION_VARIANTS.checkmark}
                    initial="hidden"
                    animate="visible"
                >
                    <Check className="h-4 w-4 text-accent" />
                </motion.span>
                <p className="text-sm">{feature}</p>
            </motion.li>
        ))}
    </ul>
);