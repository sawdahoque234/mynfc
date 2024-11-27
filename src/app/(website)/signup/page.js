"use client";
import {useState} from "react";
import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Make a request to create a new user (you should implement this logic in your backend)
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password}),
      });

      const data = await res.json();

      if (res.status === 200) {
        // Redirect to the login page after successful signup
        router.push("/login");
      } else {
        setError(data.message || "Failed to create account");
      }
    } catch (error) {
      setError("An error occurred while creating your account.");
    }
  };

  return (
    <div className="p-4 max-w-xs mx-auto mt-10">
      <h1 className="text-4xl font-bold text-center mb-2">Sign Up</h1>
      <p className="text-center mb-10 text-gray-500">Create a new account</p>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mb-4 p-2 w-full border rounded" />
        <input type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mb-4 p-2 w-full border rounded" />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition">
          Sign Up
        </button>
      </form>
      <p className="text-center mt-4">
        Already have an account?{" "}
        <a href="/login" className="text-blue-500">
          Login
        </a>
      </p>
    </div>
  );
}
