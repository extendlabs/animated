import {
  SubscriptionPlans,
  SubscriptionWithProduct,
  UserSubscriptionStatus,
  LifetimePurchaseWithProduct,
} from "@/types/pricing.type";
import { type SupabaseClient } from "@supabase/supabase-js";
import { cache } from "react";

export const getUser = cache(async (supabase: SupabaseClient) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const getProducts = cache(async (supabase: SupabaseClient) => {
  const { data: products, error } = await supabase
    .from("products")
    .select("*, prices(*)")
    .eq("active", true)
    .eq("prices.active", true)
    .order("metadata->index")
    .order("unit_amount", { referencedTable: "prices" });

  if (error) {
    return null;
  }

  return products?.map((product) => ({
    ...product,
    prices: product.prices?.map((price: any) => ({
      ...price,
      isLifetime: price.type === "one_time",
    })),
  }));
});

export async function getUserSubscriptionStatus(supabase: SupabaseClient) {
  const user = await getUser(supabase);

  if (!user) return null;

  const [subscriptionData, lifetimePurchase] = await Promise.all([
    getSubscription(supabase),
    getLifetimePurchase(supabase),
  ]);

  const status: UserSubscriptionStatus = {
    subscription: subscriptionData,
    lifetimePurchase: lifetimePurchase,
    isSubscribed: Boolean(subscriptionData?.status === "active"),
    hasLifetimePurchase: Boolean(lifetimePurchase?.status === "completed"),
    plan: null,
  };

  if (status.hasLifetimePurchase) {
    const { data: productData } = await supabase
      .from("prices")
      .select("products(name)")
      .eq("id", lifetimePurchase.price_id)
      .single();
    status.plan = (productData as any)?.products?.name;
  } else if (status.isSubscribed) {
    status.plan = subscriptionData.prices.products.name as SubscriptionPlans;
  }

  return status;
}

export async function getSubscription(supabase: SupabaseClient) {
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select(
      `
      *,
      prices (
        *,
        products (*)
      )
    `,
    )
    .eq("status", "active")
    .single();

  return subscription as SubscriptionWithProduct;
}

export async function getLifetimePurchase(supabase: SupabaseClient) {
  const { data: purchase } = await supabase
    .from("lifetime_purchases")
    .select(
      `
      *,
      prices:price_id (
        *,
        products (*)
      )
    `,
    )
    .eq("status", "completed")
    .single();

  return purchase as LifetimePurchaseWithProduct;
}

export const createAnimationWithSlides = async (
  supabase: SupabaseClient,
  name: string,
  description: string,
  user: any,
  slides: any,
) => {
  const { data, error } = await supabase.rpc("create_animation_with_slides", {
    p_name: name,
    p_description: description,
    p_user_id: user.id,
    p_slides: slides.map((slide: any) => ({
      code: slide.code,
      file_name: slide.file_name || "",
      description: slide.description || "",
    })),
  });
  return { data, error };
};

export const updateAnimationWithSlides = async (
  supabase: SupabaseClient,
  animationId: string,
  name: string,
  description: string,
  user: any,
  slides: any,
) => {
  const { error } = await supabase.rpc("update_animation_with_slides", {
    p_animation_id: animationId,
    p_name: name,
    p_description: description,
    p_user_id: user.id,
    p_slides: slides.map((slide: any) => ({
      code: slide.code,
      file_name: slide.file_name || "",
      description: slide.description || "",
    })),
  });
  return error;
};
