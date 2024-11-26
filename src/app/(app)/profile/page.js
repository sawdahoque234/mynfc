import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import PageSettingsForm from "@/components/forms/PageSettingsForm";
import {Page} from "@/models/Page";
import mongoose from "mongoose";
import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";
import cloneDeep from "clone-deep";

export const metadata = {
  title: "MyNFC | Profile",
  description: "Manage your page settings and profile information",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect("/");
  }

  await mongoose.connect(process.env.MONGO_URI);
  const page = await Page.findOne({owner: session?.user?.email});

  if (page) {
    const leanPage = cloneDeep(page.toJSON());
    leanPage._id = leanPage._id.toString();

    return (
      <div className="flex justify-center items-center  bg-white p-6">
        <div className="w-full lg:2/3">
          <PageSettingsForm page={leanPage} user={session.user} />
        </div>
      </div>
    );
  }

  // Optional: Redirect to the accountrd page if no page exists
  return redirect("/account");
}
