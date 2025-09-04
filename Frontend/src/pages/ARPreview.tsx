import React, { useState } from "react";
import { Upload, Maximize } from "lucide-react";

// 👉 Make sure the .d.ts file is in src/types/ and included in tsconfig

const ARPreview = () => {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".glb")) {
      alert("Please upload a .glb file only.");
      return;
    }

    setFile(selectedFile);
    setUrl(URL.createObjectURL(selectedFile));
  };

  const handleAR = () => {
    const viewer = document.querySelector<HTMLElement & { activateAR?: () => Promise<void> }>("model-viewer");

    if (viewer && typeof viewer.activateAR === "function") {
      viewer.activateAR().catch((err) => {
        console.error("AR activation failed:", err);
        alert("AR not supported on this device or browser.");
      });
    } else {
      alert("AR is not available. Try on iOS Safari or Android Chrome.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🔧 AR Model Tester</h1>
        <p className="text-gray-600 mb-8">
          Upload a <strong>.glb</strong> file and preview it in 3D & AR
        </p>

        {/* Upload Section */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-orange-200 mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            📁 Upload .glb File
          </label>
          <input
            type="file"
            accept=".glb"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          {file && (
            <p className="text-sm text-green-600 mt-2">
              Uploaded: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(1)} KB)
            </p>
          )}
        </div>

        {/* 3D Viewer */}
        {url ? (
          <div className="relative w-full h-[600px] bg-black/10 rounded-xl overflow-hidden">
            {/* ✅ Now fully typed — no errors */}
            <model-viewer
              src={url}
              alt="Uploaded 3D model"
              ar
              ar-modes="webxr scene-viewer quick-look"
              ar-scale="fixed"
              camera-controls
              auto-rotate
              shadow-intensity="1"
              style={{ width: '100%', height: '100%' }}
              poster="/images/loading-poster.jpg"
            >
              {/* Loading UI */}
              <div slot="progress-bar" className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Loading 3D model...</p>
                </div>
              </div>
            </model-viewer>

            {/* AR Button */}
            <button
              onClick={handleAR}
              className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-all"
            >
              <Maximize className="w-4 h-4" />
              View in AR
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[600px] bg-white rounded-xl border-2 border-dashed border-gray-300">
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-500">Upload a .glb file to preview</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ARPreview;