/* eslint-disable @next/next/no-img-element */
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import PageButtonsForm from "@/components/forms/PageButtonsForm";
import PageLinksForm from "@/components/forms/PageLinksForm";
import UsernameForm from "@/components/forms/UsernameForm";
import {Page} from "@/models/Page";
import mongoose from "mongoose";
import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";
import cloneDeep from "clone-deep";
import {faDiscord, faFacebook, faGithub, faInstagram, faTelegram, faTiktok, faWhatsapp, faYoutube, faTwitter, faLinkedin, faQuestionCircle, faPhone, faSpotify} from "@fortawesome/free-brands-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import {FaGlobe} from "react-icons/fa";
import AppHeader from "@/components/layout/AppHeader";

export const metadata = {
  title: "MyNFC | account",
  description: "Share your links, social profiles, contact info and more on one page",
};

// Mapping of button titles to FontAwesome icons and their official colors
const buttonIcons = {
  email: {icon: faEnvelope, color: "#D44638"},
  mobile: {icon: faPhone, color: "#25D366"},
  instagram: {icon: faInstagram, color: "#E1306C"},
  facebook: {icon: faFacebook, color: "#1877F2"},
  discord: {icon: faDiscord, color: "#7289DA"},
  tiktok: {icon: faTiktok, color: "#000000"},
  youtube: {icon: faYoutube, color: "#FF0000"},
  whatsapp: {icon: faWhatsapp, color: "#25D366"},
  github: {icon: faGithub, color: "#181717"},
  telegram: {icon: faTelegram, color: "#0088cc"},
  twitter: {icon: faTwitter, color: "#1DA1F2"},
  linkedin: {icon: faLinkedin, color: "#0077B5"},
  spotify: {icon: faSpotify, color: "#1DB954"},
};

export default async function AccountPage({searchParams}) {
  const session = await getServerSession(authOptions);
  const desiredUsername = searchParams?.desiredUsername;

  if (!session) {
    return redirect("/");
  }

  await mongoose.connect(process.env.MONGO_URI);
  const page = await Page.findOne({owner: session?.user?.email});

  if (page) {
    const leanPage = cloneDeep(page.toJSON());
    leanPage._id = leanPage._id.toString();

    const buttonsArray = Object.keys(leanPage.buttons || {}).map((key) => ({
      key: key,
      url: leanPage.buttons[key],
      icon: buttonIcons[key]?.icon,
      color: buttonIcons[key]?.color || "#000000", // Default to black if no color is specified
    }));

    return (
      <>
        <>
          <div className="flex flex-col-reverse md:flex-row bg-[#EEF4F8]">
            {/* Forms Section */}

            {/* Profile Section */}
            <div
              className="mx-auto flex flex-col mt-8 bg-white items-center shadow-lg p-4 h-[750px] order-none md:order-none"
              style={{
                border: "10px solid black",
                borderRadius: "50px",
              }}>
              {/* Profile Card */}
              <div className="w-[270px] h-[720px] bg-white text-black rounded-3xl flex flex-col items-center overflow-hidden relative">
                {/* Background Image */}
                <div
                  className="absolute top-0 left-0 w-full"
                  style={{
                    backgroundImage: "url('/bg.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "150px",
                    borderRadius: "1.5rem",
                  }}></div>

                {/* Profile Section */}
                <div className="relative flex justify-center items-center mt-[75px]">
                  <div className="relative w-24 h-24 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full p-1">
                    <Image src={session?.user?.image || "/default-profile.png"} alt="Profile" width={200} height={200} className="rounded-full object-cover w-full h-full border-2 border-white" />
                  </div>
                </div>

                {/* User Details */}
                <h2 className="text-lg font-bold text-black mt-2">{session?.user?.name || "James Ryan"}</h2>
                <p className="text-sm text-gray-600">{session?.user?.email || "james@gmail.com"}</p>

                {/* Buttons and Links */}
                <div className="my-4 w-full">
                  <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-2 rounded-full shadow-md">Connect with Me</button>

                  {/* Links Section */}
                  <div className={`mt-6 px-2 ${leanPage.links?.length <= 2 ? "my-24" : "my-10"}`}>
                    <ul
                      className={`${leanPage.links?.length <= 2 ? "space-y-6" : "space-y-4"}`}
                      style={{
                        maxHeight: "200px",
                        overflowY: "auto",
                      }}>
                      {leanPage.links?.map((link) => (
                        <li key={link.key} className="flex items-center space-x-4 px-4 py-2 border border-gray-300 rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-center rounded-full bg-blue-100">{link.icon ? <img src={link.icon} alt={`${link.title} icon`} /> : <FaGlobe className="text-blue-600" size={25} />}</div>
                          <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-black text-base font-medium  hover:underline">
                            {link.title || "Untitled Link"}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Social Media Buttons */}
                  <div className="mt-8">
                    <div className="flex flex-wrap justify-center">
                      {buttonsArray.map((button) => (
                        <span key={button.key} className="flex mr-3 mb-4 flex-wrap justify-center">
                          <a href={button.url} target="_blank" rel="noopener noreferrer" className="flex">
                            <FontAwesomeIcon icon={button.icon} size="lg" style={{color: button.color}} className="text-black w-10 h-10" />
                          </a>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-8 border bg-white border-gray-200 shadow-lg rounded-lg order-2 md:order-1">
              <AppHeader />
              <PageLinksForm page={leanPage} user={session.user} />
              <PageButtonsForm page={leanPage} user={session.user} />
            </div>
          </div>
        </>
      </>
    );
  }

  return (
    <div>
      <UsernameForm desiredUsername={desiredUsername} />
    </div>
  );
}
