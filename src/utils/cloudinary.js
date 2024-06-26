import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // Upload file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resourcetype: "auto",
    });
    // Upload successful
    console.log("File Uploaded on Cloudinary: ", response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove temporily saved file from local directory
    return null;
  }
};

cloudinary.uploader.upload(
  "https://upload.wikimedia.org/wikipedia/commons/4/41/Flag_of_India.svg",
  { public_id: "Indian_flag" },
  function (error, result) {
    console.log(result);
  }
);

export { uploadOnCloudinary };
