import axios from "axios";
import FormData from "form-data";

export async function uploadImageToImgBB(fileBuffer) {
  const formData = new FormData();
  formData.append("image", fileBuffer);

  try {
    const response = await axios.post("https://api.imgbb.com/1/upload", formData, {
      params: {
        key: "c477845624fe5ecf38e6e7cab72bad16",
      },
      headers: {
        ...formData.getHeaders(),
      },
    });

    console.log("ImgBB Response:", response.data);

    if (response.data.status === 200) {
      return response.data.data.url; // Return the URL of the uploaded image
    } else {
      console.error("Failed to upload image:", response.data);
      return null;
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
}
