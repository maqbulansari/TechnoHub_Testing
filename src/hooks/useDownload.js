// hooks/useDownload.js
import { useState } from "react";

export const useDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);

  const downloadFile = async (url, filename) => {
    setIsDownloading(true);
    setError(null);

    try {
      // Check if it's a relative URL
      const fullUrl = url.startsWith("http") 
        ? url 
        : `${window.location.origin}${url}`;

      const response = await fetch(fullUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/pdf",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      
      // Create download link
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      return true;
    } catch (err) {
      setError(err.message);
      console.error("Download failed:", err);
      return false;
    } finally {
      setIsDownloading(false);
    }
  };

  return { downloadFile, isDownloading, error };
};