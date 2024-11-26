import {Page} from "@/models/Page";
import {User} from "@/models/User";
import {Event} from "@/models/Event";
import {faDiscord, faFacebook, faGithub, faInstagram, faTelegram, faTiktok, faWhatsapp, faYoutube, faTwitter, faLinkedin, faSpotify} from "@fortawesome/free-brands-svg-icons";
import {faEnvelope, faLink, faLocationDot, faMobile, faPhone} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import mongoose from "mongoose";
import {btoa} from "next/dist/compiled/@edge-runtime/primitives";
import Image from "next/image";
import Link from "next/link";
import {FaGlobe} from "react-icons/fa";

export const buttonsIcons = {
  email: faEnvelope,
  mobile: faPhone,
  instagram: faInstagram,
  facebook: faFacebook,
  discord: faDiscord,
  tiktok: faTiktok,
  youtube: faYoutube,
  whatsapp: faWhatsapp,
  github: faGithub,
  telegram: faTelegram,
  twitter: faTwitter,
  linkedin: faLinkedin,
  spotify: faSpotify,
};

function buttonLink(key, value) {
  if (key === "mobile") {
    return "tel:" + value;
  }
  if (key === "email") {
    return "mailto:" + value;
  }
  return value;
}

// Utility function to check if the background color is dark or light
function isColorDark(color) {
  const rgb = parseInt(color.slice(1), 16); // Convert hex color to RGB
  const r = (rgb >> 16) & 0xff; // Extract red
  const g = (rgb >> 8) & 0xff; // Extract green
  const b = rgb & 0xff; // Extract blue

  // Calculate brightness using the luminance formula
  const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
  return brightness < 128; // If brightness is below 128, the color is dark
}

export default async function UserPage({params}) {
  const uri = params.uri;
  mongoose.connect(process.env.MONGO_URI);
  const page = await Page.findOne({uri});
  // Check if the page was not found
  if (!page) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}>
        <p style={{fontSize: "24px", fontWeight: "bold", textAlign: "center"}}>Page Not Found</p>
      </div>
    );
  }

  const user = await User.findOne({email: page.owner});

  // Optionally, also check if the user was not found
  if (!user) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}>
        <p style={{fontSize: "24px", fontWeight: "bold", textAlign: "center"}}>User Not Found</p>
      </div>
    );
  }
  await Event.create({uri: uri, page: uri, type: "view"});

  // Determine text color based on background color
  const textColor = page.bgType === "color" && isColorDark(page.bgColor) ? "white" : "black";

  return (
    <>
      <div className="min-h-screen bg-cover bg-center" style={page.bgType === "color" ? {backgroundColor: page.bgColor, color: textColor} : {backgroundImage: `url(${page.bgImage})`, color: "black"}}>
        <div className="aspect-square w-36 h-36 mx-auto p-4">
          <Image className="rounded-full w-full h-full object-cover" src={user.image} alt="avatar" width={256} height={256} />
        </div>
        <h2 className="text-2xl text-center mb-1">{page.displayName}</h2>

        <div className="max-w-xs mx-auto text-center my-2">
          <p>{page.bio}</p>
        </div>
        <div className="flex gap-2 justify-center mt-4 pb-4">
          {Object.keys(page.buttons).map((buttonKey) => (
            <Link key={buttonKey} href={buttonLink(buttonKey, page.buttons[buttonKey])} className={`rounded-full ${textColor === "white" ? "bg-gray-800 text-white" : "bg-white text-blue-950"} p-2 flex items-center justify-center `}>
              <FontAwesomeIcon className="w-8 h-8" icon={buttonsIcons[buttonKey]} />
            </Link>
          ))}
        </div>
        <div className="max-w-2xl mx-auto grid md:grid-cols-1 gap-6 p-4 px-8">
          {page.links.map((link) => (
            <Link key={link.url} target="_blank" ping={process.env.URL + "api/click?url=" + btoa(link.url) + "&page=" + page.uri} className={`${textColor === "white" ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-white text-black hover:bg-gray-100"} p-2 flex rounded-md font-extrabold border-2 border-gray-300`} href={link.url}>
              <div className="relative -left-7 w-18">
                <div className={`w-12 h-12 ${textColor === "white" ? "bg-gray-900" : "bg-blue-200"} aspect-square relative flex items-center justify-center rounded-full border-2 border-gray-300`}>
                  {link.icon && <Image className="w-full h-full object-cover rounded-full" src={link.icon} alt={"icon"} width={64} height={64} />}
                  {!link.icon && <FaGlobe icon={faLink} className="w-6 h-6" />}
                </div>
              </div>
              <div className="flex items-center justify-center shrink grow-0 overflow-hidden">
                <div className="">
                  <h3 className="">{link.title}</h3>
                  <p className="text-sm text-gray-400 overflow-hidden">{link.subtitle}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
