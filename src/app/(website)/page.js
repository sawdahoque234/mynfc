import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import HeroForm from "@/components/forms/HeroForm";
import {getServerSession} from "next-auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <main>
      <section className="lg:pt-32 pt-12 bg-white flex flex-wrap md:flex-nowrap justify-center items-center">
        <div className="max-w-6xl mb-8 md:mb-0 md:mr-8">
          <h1 className="text-6xl font-bold lg:w-2/3 w-full animate-gradient">Launch your website seamlessly</h1>

          <h2 className="text-gray-500 text-xl mt-6 mb-4">Share your links, social media profiles, contact info and more on one page</h2>
          <HeroForm user={session?.user} />
        </div>
      </section>
    </main>
  );
}
