// "use client";
// import { useRouter } from "next/navigation";
// import React, { useState } from "react";

// const LoginPage = () => {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!email) {
//       setError("Please enter an email");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await fetch("/api/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email }),
//       });

//       if (!res.ok) {
//         setError("Failed to login");
//         setLoading(false);
//         return;
//       }

//       const data = await res.json();

//       if (data.success) {
//         router.push("/dashboard");  // Navigate to dashboard after successful login
//       } else {
//         setError("Verification required. Please check your email.");
//         setLoading(false);
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Something went wrong. Please try again.");
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-container">
//       <h2>Login</h2>
//       {error && <p className="error-message">{error}</p>}
//       <form onSubmit={handleLogin}>
//         <label>Email:</label>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <button type="submit" disabled={loading}>
//           {loading ? "Logging in..." : "Login"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default LoginPage;



"use client";

import { useState } from "react";
import { signIn, verifyOTP } from "../api/otp";
import { useRouter } from "next/navigation";

export default function OtpLoginPage() {
  const [phone, setPhone] = useState(""); // Store the phone number
  const [otp, setOtp] = useState(""); // Store the OTP
  const [step, setStep] = useState(1); // Track current step: 1 = Login, 2 = Verify
  const [message, setMessage] = useState(""); // Display messages

  const router = useRouter();
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("phone", phone);
    try {
      setMessage("OTP sent successfully. Check your phone!");
      setStep(2);
      await signIn(formData);
      // Move to OTP verification step
    } catch (error) {
      console.error("Error sending OTP:", error);
      setMessage("Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("phone", phone);
    formData.append("token", otp);

    try {
      await verifyOTP(formData);
      setMessage("OTP verified successfully! Redirecting...");
      router.push("/");

    } catch (error) {
      console.error("Error verifying OTP:", error);
      setMessage("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">OTP Authentication</h1>
      {message && <p className="mb-4 text-green-600">{message}</p>}

      {step === 1 && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <label className="block">
            Phone Number (with +country code):
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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

      {step === 2 && (
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
