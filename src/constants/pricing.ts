export const PRICING_FREE_DATA = {
  name: "Free",
  description: "Get started with a free plan",
  features: [
    "2 slides",
    "2 backgrounds",
    "Default theme",
    "Default card theme",
    "Download as photo",
    "Watermark",
  ],
  price: 0,
};

export const PRICING_ANIMATION_VARIANTS = {
  badge: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { delay: 1.2 } },
  },
  card: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  },
  feature: {
    hidden: { opacity: 0, x: -50 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, delay: i * 0.1 },
    }),
  },
  checkmark: {
    hidden: { scale: 0 },
    visible: (i: number) => ({
      scale: 1,
      transition: { type: "spring", stiffness: 500, delay: i * 0.1 + 0.2 },
    }),
  },
  button: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.3 } },
  },
};
