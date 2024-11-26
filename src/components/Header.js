import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import ProfileDropdown from "@/components/buttons/ProfileDropdown";
import {getServerSession} from "next-auth";
import Link from "next/link";

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="bg-white border-gray-300 shadow-md border-b py-2">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="font-extrabold text-xl text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 hover:underline">
          MyNFC
        </Link>

        {/* Profile or Sign-In Button */}
        <div className="flex items-center gap-2">
          {session ? (
            <>
              <Link href="/account" className="flex items-center gap-2 hover:underline">
                <span className="font-semibold text-gray-800">{session.user?.name || session.user?.email}</span>
              </Link>
              <ProfileDropdown session={session} />
            </>
          ) : (
            <Link
              href="/login"
              style={{
                borderWidth: "2px",
                borderStyle: "solid",
                borderImage: "linear-gradient(to right, #B33AF2, #40B6FC) 1",
              }}
              className="border py-2 px-4 shadow rounded-md text-black  font-semibold">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
