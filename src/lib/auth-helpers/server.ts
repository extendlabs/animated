/* eslint-disable @typescript-eslint/no-unsafe-argument */
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";
import { getErrorRedirect, getStatusRedirect, getURL } from "../helpers";
import { getAuthTypes } from "./settings";

function isValidEmail(email: string) {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
}

export async function redirectToPath(path: string) {
  return redirect(path);
}

export async function SignOut(formData: FormData) {
  const pathName = String(formData.get("pathName")).trim();

  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return getErrorRedirect(
      pathName,
      "Hmm... Something went wrong.",
      "You could not be signed out.",
    );
  }

  return "/";
}

export async function signInWithEmail(formData: FormData) {
  const cookieStore = await cookies();
  const callbackURL = getURL("/auth/callback");

  const email = String(formData.get("email")).trim();
  let redirectPath: string;

  if (!isValidEmail(email)) {
    redirectPath = getErrorRedirect(
      "/",
      "Invalid email address.",
      "Please try again.",
    );
  }

  const supabase = await createClient();
  const options = {
    emailRedirectTo: callbackURL,
    shouldCreateUser: true,
  };

  // If allowPassword is false, do not create a new user
  const { allowPassword } = getAuthTypes();
  if (allowPassword) options.shouldCreateUser = false;
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: options,
  });

  if (error) {
    redirectPath = getErrorRedirect(
      "/",
      "You could not be signed in.",
      error.message,
    );
  } else if (data) {
    cookieStore.set("preferredSignInView", "email_signin", { path: "/" });
    redirectPath = getStatusRedirect(
      "/",
      "Success!",
      "Please check your email for a magic link. You may now close this tab.",
      true,
    );
  } else {
    redirectPath = getErrorRedirect(
      "/",
      "Hmm... Something went wrong.",
      "You could not be signed in.",
    );
  }

  return redirectPath;
}

export async function signInWithPassword(formData: FormData) {
  const cookieStore = await cookies();
  const email = String(formData.get("email")).trim();
  const password = String(formData.get("password")).trim();
  let redirectPath: string;

  const supabase = await createClient();
  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirectPath = getErrorRedirect("/", "Sign in failed.", error.message);
  } else if (data.user) {
    cookieStore.set("preferredSignInView", "password_signin", { path: "/" });
    redirectPath = getStatusRedirect("/", "Success!", "You are now signed in.");
  } else {
    redirectPath = getErrorRedirect(
      "/",
      "Hmm... Something went wrong.",
      "You could not be signed in.",
    );
  }

  return redirectPath;
}

export async function signUp(formData: FormData) {
  const callbackURL = getURL("/auth/callback");

  const email = String(formData.get("email")).trim();
  const password = String(formData.get("password")).trim();
  let redirectPath: string;

  if (!isValidEmail(email)) {
    redirectPath = getErrorRedirect(
      "/",
      "Invalid email address.",
      "Please try again.",
    );
  }

  const supabase = await createClient();
  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: callbackURL,
    },
  });

  if (error) {
    redirectPath = getErrorRedirect("/", "Sign up failed.", error.message);
  } else if (data.session) {
    redirectPath = getStatusRedirect("/", "Success!", "You are now signed in.");
  } else if (data.user?.identities && data.user.identities.length == 0) {
    redirectPath = getErrorRedirect(
      "/",
      "Sign up failed.",
      "There is already an account associated with this email address. Try resetting your password.",
    );
  } else if (data.user) {
    redirectPath = getStatusRedirect(
      "/",
      "Success!",
      "Please check your email for a confirmation link. You may now close this tab.",
    );
  } else {
    redirectPath = getErrorRedirect(
      "/",
      "Hmm... Something went wrong.",
      "You could not be signed up.",
    );
  }

  return redirectPath;
}
