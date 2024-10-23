"use client"
import { uploadCSVToFirebase } from "@/lib/firebase"; // Import your Firebase function
import { ChangeEvent, useState } from "react";

export default function Uploads() {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  // Handle file input change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setResponse(null); // Clear any previous response
      setError(null); // Clear any previous error
    }
  };

  // Handle the file upload to Firebase
  const handleUpload = async () => {
    if (!file) {
      setError("Please select a CSV file to upload.");
      return;
    }

    try {
      setUploading(true); // Set uploading state
      const result = await uploadCSVToFirebase(file); // Assuming this uploads the file and returns a response
      setResponse("File uploaded successfully!");
    } catch (err) {
      setError("Error uploading file. Please try again.");
      console.error(err); // Log the error
    } finally {
      setUploading(false); // Reset uploading state
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen shadow-sm mt-[10px]">
      <div>
        <h1 className="bg-slate-700 p-4 text-white">Upload Your CSV File</h1>
        
        {/* File input */}
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileChange} 
          className="my-4"
        />

        {/* Upload button */}
        <button 
          onClick={handleUpload} 
          className="bg-slate-700 hover:bg-amber-500 text-white font-bold px-4 p-4"
          disabled={uploading} // Disable button during upload
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>

        {/* Response or error message */}
        {response && <p className="text-green-500 mt-4">{response}</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}
