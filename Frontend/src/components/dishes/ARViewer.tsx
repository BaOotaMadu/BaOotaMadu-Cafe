import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, RotateCcw, Maximize, Loader2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// 👇 Define the model-viewer DOM element interface
interface ModelViewerElement extends HTMLElement {
  activateAR: () => Promise<void>;
  resetTurntableRotation: () => void;
  canActivateAR: boolean;
}

// 👇 Define props for the component
interface ARViewerProps {
  dish: {
    model_url: string;
    name: string;
    currency: string;
    price: number | string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const ARViewer: React.FC<ARViewerProps> = ({ dish, isOpen, onClose }) => {
  const viewerRef = useRef<ModelViewerElement | null>(null);

  const enterAR = () => {
    const viewer = viewerRef.current;

    if (!viewer) {
      alert("Model not loaded.");
      return;
    }

    if (typeof viewer.activateAR === 'function') {
      viewer.activateAR().catch((err) => {
        console.error("AR activation failed:", err);
        alert("AR not supported or failed to start.");
      });
    } else {
      alert("AR is not supported on this device or browser.");
    }
  };

  if (!dish?.model_url) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[80vh] p-0 bg-gradient-to-br from-orange-50 to-red-50 overflow-hidden">
        <div className="relative w-full h-full">
          {/* Header */}
          <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
              <h3 className="font-bold text-gray-900">{dish.name}</h3>
              <p className="text-sm text-gray-600">
                {dish.currency}
                {dish.price}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* 3D Model Viewer */}
          <model-viewer
            ref={(el) => {
              viewerRef.current = el as ModelViewerElement | null;
            }}
            src={dish.model_url}
            ios-src={dish.model_url}
            alt={dish.name}
            ar
            ar-modes="webxr scene-viewer quick-look"
            ar-scale="fixed"
            camera-controls
            auto-rotate
            shadow-intensity="1"
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'transparent',
            }}
            poster="/images/ar-poster.jpg"
            environment-image="neutral"
          >
            {/* Loading indicator */}
            <div slot="progress-bar" className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Loading 3D model...</p>
              </div>
            </div>
          </model-viewer>

          {/* Footer with Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-10 bg-gradient-to-t from-black/20 to-transparent">
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3 max-w-2xl mx-auto">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-2 shadow-lg flex items-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    viewerRef.current?.resetTurntableRotation();
                  }}
                  className="hover:bg-orange-100"
                >
                  <RotateCcw className="w-5 h-5" />
                </Button>
                <Button
                  onClick={enterAR}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-6"
                >
                  <Maximize className="w-4 h-4 mr-2" />
                  View in AR
                </Button>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 text-center">
                <p className="text-xs text-gray-600">
                  🍽️ Tap AR to place in your space
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ARViewer;