// "use server";

// import { supabase } from "@/utils/supabaseClient";
// import { redirect, useRouter } from "next/navigation";
// export const signIn = async (formData: FormData) => {
//   "use server";

//   const phone = formData.get("phone") as string;
//   console.log("phone", phone);
//   // Validate phone number format
//   if (!phone || !phone.startsWith("+") || phone.length < 10) {
//     console.error("Invalid phone number format");
//     return redirect("/sms-login?message=Invalid phone number format");
//   }
//   console.log("entering try block");
//   try {
//     const { data, error } = await supabase.auth.signInWithOtp({ phone });
//     console.log("entering if statement in try block");
//     if (error) {
//       console.error("Error signing in:", error.message);
//       return redirect("/sms-login?message=Could not authenticate user");
//     }

//     console.log("OTP sent successfully:", data);
//     //return redirect("/sms-login?message=Check your phone for the OTP");
//   } catch (err) {
//     console.error("Unexpected error:", err);
//     return redirect("/sms-login?message=An unexpected error occurred");
//   }
// };

// export const verifyOTP = async (formData: FormData) => {
//   "use server";

//   const phone = formData.get("phone") as string;
//   const token = formData.get("token") as string;

//   // Validate inputs
//   if (!phone || !phone.startsWith("+") || phone.length < 10 || !token) {
//     console.error("Invalid phone number or OTP token");
//     return redirect("/sms-login?message=Invalid phone number or OTP");
//   }

//   try {
//     const { error } = await supabase.auth.verifyOtp({
//       phone,
//       token,
//       type: "sms",
//     });

//     if (error) {
//       console.error("Error verifying OTP:", error.message);
//       return redirect("/sms-login?message=Could not authenticate user");
//     }

//     console.log("OTP verified successfully");
//     //return redirect("/");
//   } catch (err) {
//     console.error("Unexpected error:", err);
//     return redirect("/sms-login?message=An unexpected error occurred");
//   }
// };






// "use server";


// import { supabase } from "@/utils/supabaseClient";
// import { redirect, useRouter } from "next/navigation";
// export const signIn = async (formData: FormData) => {
//   "use server";

//   const email = formData.get("email") as string;
//   console.log("email", email);
  
//   console.log("entering try block");
//   try {
//     const { data, error } = await supabase.auth.signInWithOtp({ email });
//     console.log("entering if statement in try block");
//     if (error) {
//       console.error("Error signing in:", error.message);
//       //return redirect("/sms-login?message=Could not authenticate user");
//     }

//     console.log("OTP sent successfully:", data);
//     return ;
//     //redirect("/sms-login?message=Check your email for the OTP");
//   } catch (err) {
//     console.error("Unexpected error:", err);
//     return ;
//     //redirect("/sms-login?message=An unexpected error occurred");
//   }
// };

// export const verifyOTP = async (formData: FormData) => {
//   "use server";

//   const email = formData.get("email") as string;
//   const token = formData.get("token") as string;

//   // Validate inputs
//   // if (!email || !email.startsWith("+") || email.length < 10 || !token) {
//   //   console.error("Invalid email or OTP token");
//   //   return redirect("/sms-login?message=Invalid email number or OTP");
//   // }
//   const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//   // Validate email number format
//   if (!isValidEmail) {
//     console.error("Invalid email number format");
//     return
//     // redirect("/sms-login?message=Invalid email format");
//   }


//   try {
//     const { error } = await supabase.auth.verifyOtp({ email, token, type: "email" });
//     console.log("entering if statement in try block of otp.tsx");
//     if (!error) {
//       console.log("OTP verified successfully");

//       //return redirect("/sms-login?message=Could not authenticate user");
//     }
//     else{
//       console.error("Error while verifying OTP:", error.message);
//       throw error;
//     }
//     //return redirect("/sample");
//   } catch (err) {
//     console.error("Unexpected error:", err);
//     return ;
//     //redirect("/sms-login?message=An unexpected error occurred");
//   }
// };


"use server";

import { supabase } from "@/utils/supabaseClient";
let result:boolean = true;

export const signIn = async (formData: FormData) => {
  "use server";
  const email = formData.get("email") as string;
  console.log("email", email);
  
  console.log("entering try block");
  try {
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  // Validate email number format
  if (!isValidEmail) {
    console.error("Invalid email format");
    result = false;
    return result;
    //return redirect("/sms-login?message=Invalid email format");
  }
  else{
    const { data, error } = await supabase.auth.signInWithOtp({ email });
    console.log("data in otp.tsx - signIn",data);
    console.log("error in otp.tsx - signIn",error);
    console.log("entering else statement in try block");
    if (error) {
      console.error("Error signing in:", error.message);
      result = false;
      //return redirect("/sms-login?message=Could not authenticate user");
    }
    else{
    console.log("OTP sent successfully:", data);
    result = true;
    }
  }
  console.log("result after else",result);
    //return redirect("/sms-login?message=Check your email for the OTP");
  } 
  catch (err) {
    console.error("Unexpected error:", err);
    result =false;
    //return redirect("/sms-login?message=An unexpected error occurred");
  }
  console.log("result in otp.tsx is",result);
  return result;
};

export const verifyOTP = async (formData: FormData) => {
  "use server";

  const email = formData.get("email") as string;
  const token = formData.get("token") as string;

  // Validate inputs
  // if (!email || !email.startsWith("+") || email.length < 10 || !token) {
  //   console.error("Invalid email or OTP token");
  //   return redirect("/sms-login?message=Invalid email number or OTP");
  // }

  // const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  // // Validate email number format
  // if (!isValidEmail) {
  //   console.error("Invalid email number format");
  //   return redirect("/sms-login?message=Invalid email format");
  // }


  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });
    console.log("data in otp.tsx - verifyOTP",data);
    console.log("entering if statement in try block of otp.tsx");

  if (!data || !data.user || !data.session) {
    console.error("OTP verified, but user or session is null.");
    result = false;
    return result;
  }

    if (error) {
      console.error("Error verifying OTP:", error.message);
      result = false;
      return result;
      //return redirect("/sms-login");
    }
    else{
    console.log("OTP verified successfully");
    }
    //return redirect("/");
  } catch (err) {
    console.error("Unexpected error:", err);
    result = false;
  }
  return result;

};