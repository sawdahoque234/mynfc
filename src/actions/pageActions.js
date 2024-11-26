"use server";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {Page} from "@/models/Page";
import {User} from "@/models/User";
import mongoose from "mongoose";
import {getServerSession} from "next-auth";

export async function savePageSettings(formData) {
  mongoose.connect(process.env.MONGO_URI);
  const session = await getServerSession(authOptions);

  if (session) {
    const dataKeys = ["displayName", "location", "bio", "bgType", "bgColor", "bgImage"];

    const dataToUpdate = {};

    if (formData instanceof FormData) {
      for (const key of dataKeys) {
        if (formData.has(key)) {
          dataToUpdate[key] = formData.get(key);
        }
      }

      if (formData.has("avatar")) {
        const avatarLink = formData.get("avatar");
        await User.updateOne({email: session.user?.email}, {image: avatarLink});
      }
    } else {
      // Assume formData is a plain object
      for (const key of dataKeys) {
        if (formData[key]) {
          dataToUpdate[key] = formData[key];
        }
      }

      if (formData.avatar) {
        await User.updateOne({email: session.user?.email}, {image: formData.avatar});
      }
    }

    await Page.updateOne({owner: session?.user?.email}, dataToUpdate);

    return true;
  }

  return false;
}

export async function savePageButtons(formData) {
  mongoose.connect(process.env.MONGO_URI);
  const session = await getServerSession(authOptions);
  if (session) {
    const buttonsValues = {};
    formData.forEach((value, key) => {
      buttonsValues[key] = value;
    });
    const dataToUpdate = {buttons: buttonsValues};
    await Page.updateOne({owner: session?.user?.email}, dataToUpdate);
    return true;
  }
  return false;
}

export async function savePageLinks(links) {
  try {
    // Ensure MongoDB connection
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    // Get session
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new Error("Unauthorized access.");
    }

    const email = session.user.email;

    // Find the page by the owner's email
    const page = await Page.findOneAndUpdate(
      {owner: email}, // Find by owner
      {$set: {links}}, // Update links
      {upsert: true, new: true} // Create if not exists, return updated document
    );

    if (!page) {
      throw new Error("Page not found or could not be created.");
    }

    return {success: true, message: "Links saved successfully."};
  } catch (error) {
    console.error("Error saving links:", error);
    return {success: false, message: error.message};
  }
}
