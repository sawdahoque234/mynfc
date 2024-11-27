"use client";
import Link from "next/link";
import {FaArrowAltCircleRight} from "react-icons/fa";
import SubmitButton from "./SubmitButton";

export default function ProcessedToPrint() {
  return (
    <div className="max-w-xs mx-auto mt-3">
      <SubmitButton>
        <Link href="/products" className="">
          <span className="flex justify-center items-center">
            Processed To Print <FaArrowAltCircleRight className="ml-2" />
          </span>
        </Link>
      </SubmitButton>
    </div>
  );
}
