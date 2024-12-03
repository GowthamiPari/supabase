

// "use client";

// import { useState } from "react";
// import { signIn, verifyOTP } from "./api/otp";
// import { useRouter } from "next/navigation";

// export default function OtpLoginPage() {
//   const [phone, setPhone] = useState(""); // Store the phone number
//   const [otp, setOtp] = useState(""); // Store the OTP
//   const [step, setStep] = useState(1); // Track current step: 1 = Login, 2 = Verify
//   const [message, setMessage] = useState(""); // Display messages

//   const router = useRouter();
//   const handleSendOtp = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("phone", phone);
//     try {
//       setMessage("OTP sent successfully. Check your phone!");
//       setStep(2);
//       await signIn(formData);
//       // Move to OTP verification step
//     } catch (error) {
//       console.error("Error sending OTP:", error);
//       setMessage("Failed to send OTP. Please try again.");
//     }
//   };

//   const handleVerifyOtp = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("phone", phone);
//     formData.append("token", otp);

//     try {
//       setMessage("OTP verified successfully! Redirecting...");
//       await verifyOTP(formData);
//       router.push("/sample");

//     } catch (error) {
//       console.error("Error verifying OTP:", error);
//       setMessage("Invalid OTP. Please try again.");
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">OTP Authentication</h1>
//       {message && <p className="mb-4 text-green-600">{message}</p>}

//       {step === 1 && (
//         <form onSubmit={handleSendOtp} className="space-y-4">
//           <label className="block">
//             Phone Number (with +country code):
//             <input
//               type="text"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//               className="w-full p-2 border rounded"
//               required
//             />
//           </label>
//           <button
//             type="submit"
//             className="px-4 py-2 bg-blue-500 text-white rounded"
//           >
//             Send OTP
//           </button>
//         </form>
//       )}

//       {step === 2 && (
//         <form onSubmit={handleVerifyOtp} className="space-y-4">
//           <label className="block">
//             OTP:
//             <input
//               type="text"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               className="w-full p-2 border rounded"
//               required
//             />
//           </label>
//           <button
//             type="submit"
//             className="px-4 py-2 bg-green-500 text-white rounded"
//           >
//             Verify OTP
//           </button>
//         </form>
//       )}
//     </div>
//   );
// }


// "use client";

// import Link from "next/link";
// import { signIn, verifyOTP } from "./actions";
// import { useState, useEffect } from "react";
// import { useSearchParams } from "next/navigation"; // Add this import

// export default function SMSLogin() {
//   const [otpSent, setOtpSent] = useState(false);
//   const searchParams = useSearchParams(); // Use useSearchParams hook

//   return (
//     <div className="flex-1 flex flex-col w-full px-8 sm:max-w-xl justify-center gap-2">
//       <Link
//         href="/"
//         className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
//       >
//         <svg
//           className="w-4 h-4 mr-2"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             className="inline-flex"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth="2"
//             d="M10 19l-7-7m0 0l7-7m-7 7h18"
//           ></path>
//         </svg>
//         Back
//       </Link>
//       <h1 className="text-4xl font-bold">Sign in using email number</h1>
//       <p className="text-foreground">
//         {searchParams.get("message") || "Sign in to your account"} {/* Use searchParams.get() */}
//       </p>
//       <form
//         action={async (formData) => {
//           if (otpSent) {
//             await verifyOTP(formData);
//           } else {
//             try {
//               await signIn(formData);
//               setOtpSent(true);
//             } catch (e) {
//               console.error(e);
//             }
//           }
//         }}
//         className="flex flex-col gap-2"
//       >
//         <label htmlFor="email" className="flex flex-col gap-1">
//           <span className="text-foreground">email</span>
//           <input
//             type="tel"
//             name="email"
//             id="email"
//             className="rounded-md px-4 py-2 bg-inherit border mb-2"
//             placeholder="+91 1234567890"
//           />
//         </label>
//         {/* Conditionally render the OTP input based on otpSent */}
//         {otpSent && (
//           <label htmlFor="token" className="flex flex-col gap-1">
//             <span className="text-foreground">Your OTP</span>
//             <input
//               type="text"
//               name="token"
//               id="token"
//               required
//               placeholder="123456"
//               className="rounded-md px-4 py-2 bg-inherit border mb-2"
//             />
//           </label>
//         )}
//         <button
//           type="submit"
//           className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2 max-w-max hover:bg-green-600"
//         >
//           {otpSent ? "Verify OTP" : "Send OTP"}
//         </button>
//         {otpSent && <ExpirationTimer />}
//       </form>
//     </div>
//   );
// }

// const ExpirationTimer = () => {
//   const expirationTime = 60;
//   const [timeLeft, setTimeLeft] = useState(expirationTime);

//   let id: any = null;

//   useEffect(() => {
//     if (timeLeft > 0) {
//       id = setTimeout(() => {
//         setTimeLeft(timeLeft - 1);
//       }, 1000);
//     }
//     return () => {
//       clearTimeout(id);
//     };
//   }, [timeLeft]);

//   return (
//     <div className="flex justify-between items-center">
//       <p className="text-foreground text-sm">
//         {timeLeft > 0 ? `OTP expires in ${timeLeft} seconds` : "OTP expired!"}
//       </p>
//       <button
//         className="text-foreground text-sm underline disabled:text-foreground/50 disabled:cursor-not-allowed"
//         formAction={async (formData) => {
//           await signIn(formData);
//           setTimeLeft(expirationTime);
//         }}
//         disabled={timeLeft > 0}
//       >
//         Resend OTP
//       </button>
//     </div>
//   );
// };

"use client";

import { useState } from "react";
import { signIn, verifyOTP } from "./api/otp";
import { useRouter } from "next/navigation";
import { error } from "console";
import { supabase } from "@/utils/supabaseClient";
import UserService from "./service/userService";
export default function OtpLoginPage() {
  const [email, setemail] = useState(""); // Store the email number
  const [otp, setOtp] = useState(""); // Store the OTP
  const [step, setStep] = useState(1); // Track current step: 1 = Login, 2 = Verify
  const [message, setMessage] = useState(""); // Display messages
  const service:UserService = new UserService();
  const router = useRouter();
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    try {
      const result = await service.sendOtp(formData.get("email") as string);
      console.log("result is", result);
      if (result == true) {
        setMessage("OTP sent successfully. Check your email!");
        setStep(2);
      }
      else if (result == false) {
        setMessage("Failed to send OTP. Please check your email and try again.");
      }
      else{
        setMessage(result+", Please try again later.");
        // if(result == "email rate limit exceeded"){
        //   setMessage("Please try again after 1 minute ");
        // }
      }
    
      // Move to OTP verification step
    } catch (error) {
      console.error("Error sending OTP:", error);
      setMessage("Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    formData.append("token", otp);
    setMessage("");
    try {
      console.log("form data is", formData.get("email"));
      //const result = await supabase.auth.verifyOtp
       const result = await service.verifyOtpAndSignIn(formData);
      //validate if my otp entered and otp generated are matched or not 
      if(result){
        setMessage("OTP verified successfully! Redirecting...");
        router.push("/sample");
      }
      else{
        setMessage("Invalid OTP. Please try again.");
      }

    } catch (error) {
      setMessage("Invalid OTP. Please try again.");
      console.error("Error verifying OTP:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">OTP Authentication</h1>
      {message && <p className="mb-4 text-green-600">{message}</p>}

      {step === 1 && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <label className="block">
            email:
            <input
              type="text"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </label>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Send OTP
          </button>
        </form>
      )}

      {step === 2 &&  (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <label className="block">
            OTP:
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </label>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Verify OTP
          </button>
        </form>
      )}
    </div>
  );
}










// const requestOtp = async () => {
//   if (isCooldown) return;

//   try {
//     // Your Supabase OTP request logic
//     const { error } = await supabase.auth.signInWithOtp({ email: 'user@example.com' });
//     if (error) throw error;

//     // Start cooldown
//     setIsCooldown(true);
//     setCountdown(60); // 60 seconds cooldown
//     const interval = setInterval(() => {
//       setCountdown((prev) => {
//         if (prev <= 1) {
//           clearInterval(interval);
//           setIsCooldown(false);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//   } catch (error) {
//     console.error('Error requesting OTP:', error.message);
//   }
// };

// return (
//   <div>
//     <button onClick={requestOtp} disabled={isCooldown}>
//       {isCooldown ? `Wait ${countdown}s` : 'Request OTP'}
//     </button>
//   </div>
// );
// };

// export default OtpRequest;
