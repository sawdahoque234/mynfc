"use client";

import {signIn} from "next-auth/react";
import {redirect, useRouter} from "next/navigation";
import {useEffect} from "react";

export default function HeroForm({user}) {
  const router = useRouter();
  useEffect(() => {
    if ("localStorage" in window && window.localStorage.getItem("desiredUsername")) {
      const username = window.localStorage.getItem("desiredUsername");
      window.localStorage.removeItem("desiredUsername");
      redirect("/account?desiredUsername=" + username);
    }
  }, []);
  async function handleSubmit(ev) {
    ev.preventDefault();
    const form = ev.target;
    const input = form.querySelector("input");
    const username = input.value;
    if (username.length > 0) {
      if (user) {
        router.push("/account?desiredUsername=" + username);
      } else {
        window.localStorage.setItem("desiredUsername", username);
        await signIn("google");
      }
    }
  }
  return (
    <form onSubmit={handleSubmit} className="inline-flex items-center shadow-lg bg-white border border-gray-300 rounded-md">
      <span className="bg-white py-2 mb-2 pl-4 rounded-md">mynfc/</span>
      <input
        type="text"
        className="focus:outline-none border-none py-2 pl-0 ml-0"
        placeholder="username"
        style={{
          backgroundColor: "white",
        }}
      />
      <button type="submit" className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-md text-white py-4 px-6 whitespace-nowrap">
        Live
      </button>
    </form>
  );
}
