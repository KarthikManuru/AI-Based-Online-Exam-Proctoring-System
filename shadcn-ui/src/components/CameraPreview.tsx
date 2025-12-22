import { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff } from 'lucide-react';
import { getCurrentStream } from '@/lib/camera';

interface CameraPreviewProps {
  className?: string;
}

export default function CameraPreview({ className = '' }: CameraPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const stream = getCurrentStream();
    
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      setIsActive(true);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-300">
        {isActive ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
              <Camera className="h-3 w-3" />
              <span>Live</span>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <CameraOff className="h-12 w-12 mb-2 opacity-50" />
            <p className="text-sm opacity-75">Camera not active</p>
          </div>
        )}
      </div>
      <p className="text-xs text-gray-600 mt-2 text-center">
        Camera preview - Ensure you are visible
      </p>
    </div>
  );
}