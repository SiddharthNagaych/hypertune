import { getStorage, ref, uploadBytes } from "firebase/storage";
import { initializeApp } from "firebase/app";

// Firebase configuration object from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Function to upload CSV to Firebase
export const uploadCSVToFirebase = async (file: File) => {
  try {
    const storageRef = ref(storage, `csv-files/${file.name}`); // Use a relative path
    await uploadBytes(storageRef, file);
    console.log("File uploaded to Firebase Storage!");
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};