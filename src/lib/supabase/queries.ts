/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { type SupabaseClient } from "@supabase/supabase-js";
import { cache } from "react";

export const getUser = cache(async (supabase: SupabaseClient) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const getSubscription = cache(async (supabase: SupabaseClient) => {
  const { data: subscription, error } = await supabase
    .from("subscriptions")
    .select("*, prices(*, products(*))")
    .in("status", ["trialing", "active"])
    .maybeSingle();

  return subscription;
});

export const getProducts = cache(async (supabase: SupabaseClient) => {
  const { data: products, error } = await supabase
    .from("products")
    .select("*, prices(*)")
    .eq("active", true)
    .eq("prices.active", true)
    .order("metadata->index")
    .order("unit_amount", { referencedTable: "prices" });

  return products;
});

export const getUserDetails = cache(async (supabase: SupabaseClient) => {
  const { data: userDetails } = await supabase
    .from("users")
    .select("*")
    .single();
  return userDetails;
});

export const updateAnimationWithSlides = async (supabase: SupabaseClient, animationId: string, name: string, description: string, user: any, slides: any) => {
  const { error } = await supabase.rpc('update_animation_with_slides', {
    p_animation_id: animationId,
    p_name: name,
    p_description: description,
    p_user_id: user.id,
    p_slides: slides.map((slide: any) => ({
        code: slide.code,
        file_name: slide.file_name || '',
        description: slide.description || ''
    }))
  });
  return error;
};


export const createAnimationWithSlides = async (supabase: SupabaseClient, name: string, description: string, user: any, slides: any) => {
  const { data, error } = await supabase.rpc('create_animation_with_slides', {
    p_name: name,
    p_description: description,
    p_user_id: user.id,
    p_slides: slides.map((slide: any) => ({
        code: slide.code,
        file_name: slide.file_name || '',
        description: slide.description || ''
    }))
  });
  return {data, error};
};