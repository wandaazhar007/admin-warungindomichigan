import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
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


/**
 * Deletes an image from Firebase Storage based on its download URL.
 * @param imageUrl The public download URL of the image to delete.
 * @returns A promise that resolves when the image is deleted.
 */
export const deleteImageByUrl = async (imageUrl: string): Promise<void> => {
  if (!imageUrl) return; // Do nothing if there's no URL

  try {
    // Get a reference to the image from its URL
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error: any) {
    // It's okay if the image doesn't exist (e.g., already deleted).
    // We only log errors that are not 'object-not-found'.
    if (error.code !== 'storage/object-not-found') {
      console.error("Error deleting image from storage:", error);
      throw new Error("Image deletion failed.");
    }
  }
};
