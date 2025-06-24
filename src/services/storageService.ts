import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

/**
 * Uploads an image file to Firebase Storage.
 * @param imageFile The image file to upload.
 * @returns A promise that resolves with the public download URL of the uploaded image.
 */
export const uploadImage = async (imageFile: File): Promise<string> => {
  // Create a unique filename using uuid to prevent overwriting files
  const imageId = uuidv4();
  const imageRef = ref(storage, `product_images/${imageId}`);

  try {
    const snapshot = await uploadBytes(imageRef, imageFile);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Image upload failed.");
  }
};