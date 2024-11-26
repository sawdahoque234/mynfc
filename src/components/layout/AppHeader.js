"use client";
import Link from "next/link";

export default function AppHeader() {
  return (
    <nav className="flex items-center space-x-4 px-4 py-4 bg-white shadow-lg">
      {/* Links Tab */}
      <Link
        href={"/account"}
        className="px-6 py-1 border text-black font-medium rounded-lg"
        style={{
          borderWidth: "2px",
          borderRadius: "20%",
          borderStyle: "solid",
          borderImage: "linear-gradient(to right, #B33AF2, #40B6FC) 1",
        }}>
        Links
      </Link>
    </nav>
  );
}
