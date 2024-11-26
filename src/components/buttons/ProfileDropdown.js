"use client";

import {useState} from "react";
import Image from "next/image";
import Link from "next/link";
import LogoutButton from "@/components/buttons/LogoutButton";

export default function ProfileDropdown({session}) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 focus:outline-none">
        <div className="rounded-full overflow-hidden">
          <Image src={session.user.image} width={48} height={48} alt="avatar" />
        </div>
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>
            Account
          </Link>
          <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>
            Profile
          </Link>
          <LogoutButton iconLeft={false} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" />
        </div>
      )}
    </div>
  );
}
