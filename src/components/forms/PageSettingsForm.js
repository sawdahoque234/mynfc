"use client";

import {savePageSettings} from "@/actions/pageActions";
import SubmitButton from "@/components/buttons/SubmitButton";
import {upload} from "@/libs/upload";
import {faCloudArrowUp} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Image from "next/image";
import {useState, useEffect} from "react";
import toast from "react-hot-toast";

export default function PageSettingsForm({page, user}) {
  const [avatar, setAvatar] = useState(user?.image || "/placeholder-avatar.png");
  const [displayName, setDisplayName] = useState(page?.displayName || "");
  const [bio, setBio] = useState(page?.bio || "");
  const [bgColor, setBgColor] = useState(page?.bgColor || "#ffffff"); // Background color state
  const [isIconLoading, setIsIconLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsIconLoading(false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  // Utility function to check if a color is dark or light
  function isColorDark(color) {
    const rgb = parseInt(color.slice(1), 16); // Convert hex to RGB
    const r = (rgb >> 16) & 0xff; // Extract red
    const g = (rgb >> 8) & 0xff; // Extract green
    const b = rgb & 0xff; // Extract blue

    // Calculate brightness using the luminance formula
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    return brightness < 128; // If brightness is less than 128, the color is dark
  }

  // Determine text color based on background color
  const textColor = isColorDark(bgColor) ? "text-white" : "text-black";

  async function saveBaseSettings(formData) {
    const formDataObject = new FormData();
    formDataObject.append("avatar", formData.avatar);
    formDataObject.append("displayName", formData.displayName);
    formDataObject.append("bio", formData.bio);
    formDataObject.append("bgColor", formData.bgColor);

    const result = await savePageSettings(formDataObject);
    if (result) {
      toast.success("Settings saved successfully!");
    }
  }

  async function handleAvatarImageChange(ev) {
    await upload(ev, (link) => {
      setAvatar(link);
    });
  }

  return (
    <div className={`w-full lg:w-1/3 p-6 mx-auto block bg-cover bg-center rounded-md ${textColor}`} style={{backgroundColor: bgColor}}>
      {/* Profile Image Overlapping Section */}
      <h2 className="text-center text-2xl font-semibold mt-4">👋 Setup Your Page</h2>

      <div className="relative flex flex-col items-center pt-8">
        <div className="rounded-full border-4 border-white shadow-lg">
          <Image className="rounded-full object-cover" src={avatar} alt="Profile Avatar" width={96} height={96} />
        </div>
        {/* Header */}
      </div>

      <div className="bg-white shadow-lg p-6 mx-auto border border-gray-200 rounded-xl mt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveBaseSettings({
              avatar,
              displayName,
              bio,
              bgColor,
            });
          }}>
          {/* Name Field */}
          <div className="mb-4">
            <input type="text" placeholder="Your Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200  text-black" />
          </div>

          {/* Bio Field */}
          <div className="mb-4">
            <textarea placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-black focus:ring focus:ring-blue-200  resize-none" rows="3" />
          </div>

          {/* Background Color Picker */}
          <div className="mb-2 flex">
            <label htmlFor="bgColor" className="block text-black mb-2">
              Background Color
            </label>
            <div className="flex items-center mx-3">
              <input type="color" id="bgColor" name="bgColor" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="block cursor-pointer" />
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <SubmitButton>
              <span>Get Started</span>
            </SubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
}
