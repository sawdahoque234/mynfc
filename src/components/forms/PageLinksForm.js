"use client";

import {savePageLinks} from "@/actions/pageActions";
import SubmitButton from "@/components/buttons/SubmitButton";
import {FiTrash2} from "react-icons/fi";
import {CiCirclePlus} from "react-icons/ci";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSave} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import toast from "react-hot-toast";

export default function PageLinksForm({page}) {
  const [links, setLinks] = useState(page.links || []);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [urlErrors, setUrlErrors] = useState({});

  function validateLinks(linkList) {
    const errors = {};
    const urlSet = new Set();

    linkList.forEach((link) => {
      const url = link.url.trim();

      // Check for valid domain (must contain a dot)
      if (!/\./.test(url) || url.startsWith(".") || url.endsWith(".")) {
        errors[link.key] = "Invalid domain name.";
      }

      // Check for duplicate URLs
      if (urlSet.has(url)) {
        errors[link.key] = "Duplicate URL.";
      } else {
        urlSet.add(url);
      }
    });

    return errors;
  }

  async function save() {
    const updatedLinks = links.map((link) => {
      if (link.url && !/^https?:\/\//i.test(link.url)) {
        link.url = `https://${link.url.trim()}`;
      }
      return link;
    });

    const errors = validateLinks(updatedLinks);
    if (Object.keys(errors).length > 0) {
      setUrlErrors(errors);
      toast.error("Please fix the errors before saving.");
      return;
    }

    try {
      await savePageLinks(updatedLinks);
      setLinks(updatedLinks);
      setUrlErrors({});
      setHasUnsavedChanges(false);
      toast.success("Links saved successfully!");
    } catch (error) {
      toast.error("Failed to save links.");
      console.error(error);
    }
  }

  function addNewLink() {
    setLinks((prev) => [...prev, {key: Date.now().toString(), title: "", url: ""}]);
    setHasUnsavedChanges(true);
  }

  function handleLinkChange(key, prop, ev) {
    const value = ev.target.value;

    setLinks((prev) => {
      const updatedLinks = prev.map((link) => (link.key === key ? {...link, [prop]: value} : link));

      // Validate updated list for URL errors
      if (prop === "url") {
        const errors = validateLinks(updatedLinks);
        setUrlErrors(errors);
      }
      return updatedLinks;
    });

    setHasUnsavedChanges(true);
  }

  function removeLink(linkKeyToRemove) {
    const updatedLinks = links.filter((link) => link.key !== linkKeyToRemove);

    setLinks(updatedLinks);
    setHasUnsavedChanges(true);

    savePageLinks(updatedLinks)
      .then(() => {
        toast.success("Link removed successfully!");
      })
      .catch((err) => {
        toast.error("Failed to remove link from the database.");
        console.error(err);
      });
  }

  return (
    <div className="bg-white shadow-lg border-gray-100 lg:w-[700px] w-full p-4">
      {/* Top Buttons */}
      <div className="flex mb-4">
        <button onClick={addNewLink} className="px-6 py-2 rounded-md bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium flex items-center gap-2">
          <CiCirclePlus size={25} />
          Add Link
        </button>
      </div>

      {/* Form */}
      <form action={save}>
        <div className="mt-4">
          {links.map((l) => (
            <div key={l.key} className="flex items-center justify-between">
              <input type="text" required value={l.title} onChange={(ev) => handleLinkChange(l.key, "title", ev)} placeholder="Title" className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500 transition-all mr-2" />
              <input type="text" value={l.url} onChange={(ev) => handleLinkChange(l.key, "url", ev)} placeholder="https://example.com" className={`w-full bg-gray-200 border rounded-md px-3 py-2 outline-none ${urlErrors[l.key] ? "border-red-500" : "border-gray-300"} focus:border-blue-500 transition-all`} />
              {urlErrors[l.key] && <span className="text-red-500 text-sm mt-1">{urlErrors[l.key]}</span>}
              <div className="flex items-center flex-1">
                <button type="button" onClick={() => removeLink(l.key)} className="flex justify-center item-center py-2 hover:text-red-500 text-black transition-colors" aria-label="Delete link">
                  <FiTrash2 size={25} className="mx-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Save Button */}
        {hasUnsavedChanges && links.length > 0 && (
          <div className="pt-4 mt-8 max-w-xs mx-auto">
            <SubmitButton>
              <FontAwesomeIcon icon={faSave} />
              <span>Save</span>
            </SubmitButton>
          </div>
        )}
      </form>
    </div>
  );
}
