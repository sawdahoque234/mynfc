"use client";

import {useEffect, useState} from "react";
import {savePageButtons} from "@/actions/pageActions";
import SubmitButton from "@/components/buttons/SubmitButton";
import SectionBox from "@/components/layout/SectionBox";
import {ReactSortable} from "react-sortablejs";
import {FaDiscord, FaFacebook, FaGithub, FaInstagram, FaTelegram, FaTiktok, FaWhatsapp, FaYoutube, FaLinkedin, FaSpotify, FaTwitter, FaEnvelope} from "react-icons/fa";
import {MdOutlineDragIndicator} from "react-icons/md"; // For drag handle
import {FiTrash2} from "react-icons/fi"; // Trash icon
import {AiOutlinePlus} from "react-icons/ai"; // Plus icon
import toast from "react-hot-toast";
import {CiCirclePlus} from "react-icons/ci";

export const allButtons = [
  {
    key: "email",
    label: "Email",
    icon: FaEnvelope,
    placeholder: "Email",
    pattern: /^mailto:/,
    color: "#D44638", // Example: Gmail red
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    icon: FaWhatsapp,
    placeholder: "01234567890",
    pattern: /^https:\/\/(www\.)?wa\.me\//,
    color: "#25D366", // WhatsApp green
  },
  {
    key: "telegram",
    label: "Telegram",
    icon: FaTelegram,
    placeholder: "1234567890",
    pattern: /^https:\/\/t\.me\//,
    color: "#0088CC", // Telegram blue
  },
  {
    key: "instagram",
    label: "Instagram",
    icon: FaInstagram,
    placeholder: "https://instagram.com/",
    pattern: /^https:\/\/(www\.)?instagram\.com\//,
    color: "#E1306C", // Instagram pink
  },
  {
    key: "facebook",
    label: "Facebook",
    icon: FaFacebook,
    placeholder: "https://facebook.com/",
    pattern: /^https:\/\/(www\.)?facebook\.com\//,
    color: "#1877F2", // Facebook blue
  },
  {
    key: "youtube",
    label: "YouTube",
    icon: FaYoutube,
    placeholder: "https://youtube.com/",
    pattern: /^https:\/\/(www\.)?youtube\.com\//,
    color: "#FF0000", // YouTube red
  },
  {
    key: "github",
    label: "Github",
    icon: FaGithub,
    placeholder: "https://github.com/",
    pattern: /^https:\/\/(www\.)?github\.com\//,
    color: "#171515", // GitHub black
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: FaLinkedin,
    placeholder: "https://linkedin.com/",
    pattern: /^https:\/\/(www\.)?linkedin\.com\//,
    color: "#0077B5", // LinkedIn blue
  },
  {
    key: "tiktok",
    label: "TikTok",
    icon: FaTiktok,
    placeholder: "https://tiktok.com/",
    pattern: /^https:\/\/(www\.)?tiktok\.com\//,
    color: "#000000", // TikTok black
  },
  {
    key: "discord",
    label: "Discord",
    icon: FaDiscord,
    placeholder: "https://discord.com/",
    pattern: /^https:\/\/(www\.)?discord\.com\//,
    color: "#5865F2", // Discord blurple
  },
  {
    key: "spotify",
    label: "Spotify",
    icon: FaSpotify,
    placeholder: "https://spotify.com/",
    pattern: /^https:\/\/(www\.)?open\.spotify\.com\//,
    color: "#1DB954", // Spotify green
  },
  {
    key: "twitter",
    label: "Twitter",
    icon: FaTwitter,
    placeholder: "https://twitter.com/",
    pattern: /^https:\/\/(www\.)?(twitter\.com|x\.com)\//,
    color: "#1DA1F2", // Twitter blue
  },
];

function upperFirst(str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
}

export default function PageButtonsForm({user, page}) {
  const pageSavedButtonsKeys = page?.buttons ? Object.keys(page.buttons) : [];
  const pageSavedButtonsInfo = pageSavedButtonsKeys.map((k) => allButtons.find((b) => b.key === k));
  const [activeButtons, setActiveButtons] = useState(pageSavedButtonsInfo);

  function addButtonToProfile(button) {
    setActiveButtons((prevButtons) => [...prevButtons, button]);
  }

  async function removeButton(button) {
    const updatedButtons = activeButtons.filter((b) => b.key !== button.key);
    setActiveButtons(updatedButtons);

    const formData = new FormData();
    updatedButtons.forEach((b) => {
      formData.append(b.key, page.buttons?.[b.key] || "");
    });

    try {
      await savePageButtons(formData); // Save to the database
      toast.success("Removed successfully!");
    } catch (error) {
      toast.error("Failed to save changes to the database.");
    }
  }

  function handleInputChange(event, buttonKey) {
    const value = event.target.value;
    let formattedValue = value.trim(); // Trim extra spaces

    if (buttonKey === "whatsapp") {
      if (!formattedValue.startsWith("https://wa.me/")) {
        formattedValue = `https://wa.me/${formattedValue.replace(/\D/g, "")}`;
      }
    } else if (buttonKey === "telegram") {
      if (!formattedValue.startsWith("https://t.me/")) {
        formattedValue = `https://t.me/${formattedValue}`;
      }
    } else if (buttonKey === "email") {
      // Email validation
      if (!formattedValue.includes("@")) {
        event.target.setCustomValidity("Please enter a valid email address.");
      } else {
        event.target.setCustomValidity(""); // Clear validation error
      }
    }

    event.target.value = formattedValue; // Update the input value dynamically
  }

  function validateFormData(formData) {
    for (const [key, value] of formData.entries()) {
      const button = allButtons.find((b) => b.key === key);

      if (button) {
        if (key === "email") {
          if (!value.includes("@")) {
            return `Invalid email format.`;
          }
        } else if (button.pattern && value && !button.pattern.test(value)) {
          return `Invalid input for ${upperFirst(button.label)}.`;
        }
      }
    }
    return null;
  }

  async function saveButtons(formData) {
    const validationError = validateFormData(formData);
    if (validationError) {
      toast.error(validationError);
      return;
    }
    await savePageButtons(formData);
    toast.success("Social Profile saved!");
  }

  const availableButtons = allButtons.filter((b1) => !activeButtons.find((b2) => b1.key === b2.key));

  return (
    <div className="bg-white lg:w-[700px] w-full p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          saveButtons(formData);
        }}>
        <h2 className="text-2xl font-bold mb-4">Socials</h2>
        {activeButtons.map((b) => (
          <div key={b.key} className="mb-4 md:flex items-center">
            <div className="flex h-full text-gray-700 pr-4 gap-2 items-center lg:min-w-[130px]">
              <b.icon style={{color: b.color}} size={25} />
              <span>{upperFirst(b.label)}:</span>
            </div>
            <div className="grow flex">
              <input placeholder={b.placeholder} name={b.key} defaultValue={page.buttons?.[b.key]} type="text" className="grow border px-2 py-1 rounded" onChange={(e) => handleInputChange(e, b.key)} style={{marginBottom: "0"}} />
              <button onClick={() => removeButton(b)} type="button" className="py-2 px-4 flex items-center justify-center rounded hover:text-red-500">
                <FiTrash2 size={25} />
              </button>
            </div>
          </div>
        ))}
        <div className="flex flex-wrap justify-center items-center mt-4 border py-4 bg-[#F8FBFC] border-dashed border-[#80808F] rounded-md">
          {availableButtons.map((b) => (
            <button key={b.key} type="button" onClick={() => addButtonToProfile(b)} className="flex space-x-4 items-center justify-center mb-2 rounded hover:text-red-500 ml-2 transition-colors">
              <b.icon
                size={25}
                style={{color: b.color}} // Apply the color dynamically
              />
            </button>
          ))}
        </div>

        {activeButtons.length > 0 && (
          <div className="max-w-xs mx-auto mt-8">
            <SubmitButton>
              <CiCirclePlus size={25} />
              <span>Save</span>
            </SubmitButton>
          </div>
        )}
      </form>
    </div>
  );
}
