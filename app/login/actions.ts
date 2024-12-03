
"use server";

import { supabase } from "@/utils/supabaseClient";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const signIn = async (formData: FormData) => {
  "use server";
  const phone = formData.get("phone") as string;
  
  const {data, error } = await supabase.auth.signInWithOtp({
    phone});
  if (error) {
    console.error('Error signing in:', error);
    return redirect("/sms-login?message=Could not authenticate user");
  } else {
    console.log('OTP sent:', data);
    return redirect("/sms-login?message=Check your phone for the OTP");

  }
};

export const verifyOTP = async (formData: FormData) => {
  "use server";
  const phone = formData.get("phone") as string;
  const token = formData.get("token") as string;

  const { error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: "sms",
  });

  if (error) {
    console.error(error);
   return redirect("/sms-login?message=Could not authenticate user");
  }

  return redirect("/sample");
};