"use client";
import {faRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {signOut} from "next-auth/react";

export default function LogoutButton({}) {
  return (
    <div className=" block px-4 pb-2 text-sm text-gray-700 hover:bg-gray-100">
      <button onClick={() => signOut()}>
        <span>Logout</span>
        <FontAwesomeIcon icon={faRightFromBracket} className="mx-2" />
      </button>
    </div>
  );
}
