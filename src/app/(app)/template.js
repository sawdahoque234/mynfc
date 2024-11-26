import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import AppSidebar from "@/components/layout/AppSidebar";
import {Page} from "@/models/Page";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import mongoose from "mongoose";
import {getServerSession} from "next-auth";
import {Lato} from "next/font/google";
import "../globals.css";
import {headers} from "next/headers";
import Image from "next/image";
import Link from "next/link";
import {redirect} from "next/navigation";
import {Toaster} from "react-hot-toast";
import ProfileDropdown from "@/components/buttons/ProfileDropdown";

const lato = Lato({subsets: ["latin"], weight: ["400", "700"]});

export const metadata = {
  title: "MyNFC",
  description: "",
};

export default async function AppTemplate({children}) {
  const headersList = headers();
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect("/");
  }
  mongoose.connect(process.env.MONGO_URI);
  const page = await Page.findOne({owner: session.user.email});

  return (
    <html lang="en">
      <body className={lato.className}>
        <Toaster />
        <main className="min-h-screen flex flex-col ">
          {/* Header Section */}
          <header className="bg-white shadow-lg px-4 py-2 border-gray-300  border-b">
            <div className="flex items-center justify-between">
              <nav className=" md:block ">
                <AppSidebar />
              </nav>
              <div className="flex items-center gap-4 relative">
                {page && (
                  <Link target="_blank" href={"/" + page.uri} className="flex items-center gap-1 hover:underline">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 font-semibold">mynfc</span>
                    <span className="text-gray-400">/</span>
                    <span>{page.uri}</span>
                  </Link>
                )}

                <ProfileDropdown session={session} />
              </div>
            </div>
          </header>

          {/* Content Section */}
          <div className="grow flex flex-col">{children}</div>
        </main>
      </body>
    </html>
  );
}
