import {uploadImageToImgBB} from "@/libs/storage";

export async function POST(req) {
  const formData = await req.formData();

  if (formData.has("file")) {
    const file = formData.get("file");

    const chunks = [];
    for await (const chunk of file.stream()) {
      chunks.push(chunk);
    }
    const fileBuffer = Buffer.concat(chunks);

    try {
      const imgBBUrl = await uploadImageToImgBB(fileBuffer);

      if (imgBBUrl) {
        return new Response(JSON.stringify({url: imgBBUrl}), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        throw new Error("Failed to upload image to ImgBB.");
      }
    } catch (error) {
      console.error("Error uploading image to ImgBB:", error);
      return new Response(JSON.stringify({error: error.message}), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  } else {
    return new Response(JSON.stringify({error: "No file uploaded."}), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
