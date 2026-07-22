export type OnboardingItem = {
  id: number;
  title: string;
  highlight: string;
  description: string;
  image: any;
};


export const onboardingData: OnboardingItem[] = [
  {
    id: 1,
    title: "Your Shopping",
    highlight: "Journey Starts Here",
    description:
      "Shop smarter with handpicked best sellers and exclusive discounts.",
    image: require("@/assets/images/onboarding_image_1.png"),
  },
  {
    id: 2,
    title: "Your Favorites,",
    highlight: "One Tap Away",
    description:
      "Save the products you love, organize your wishlist, and shop whenever the time is right.",
    image: require("@/assets/images/onboarding_image_2.png"),
  },
  {
    id: 3,
    title: "Seamless Tracking",
    highlight: "from Cart to Home",
    description:
      "Track your order from checkout to delivery with live updates every step of the way.",
    image: require("@/assets/images/onboarding_image_3.png"),
  },
];