import { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, Maximize2, Minimize2, AlertTriangle } from 'lucide-react';
import { getCurrentStream } from '@/lib/camera';
import type { ObjectDetectionModel, DetectedObject } from '@/lib/types';

interface DraggableCameraPreviewProps {
  onCheatDetected?: (reason: string) => void;
  enabled?: boolean;
}

export default function DraggableCameraPreview({ onCheatDetected, enabled = true }: DraggableCameraPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [detectionStatus, setDetectionStatus] = useState<string>('Initializing...');
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 280, y: 80 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const stream = getCurrentStream();
    
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      setIsActive(true);
      
      // Load detection model
      if (enabled) {
        loadDetectionModel();
      }
    }

    return () => {
      stopDetection();
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [enabled]);

  const loadDetectionModel = async () => {
    try {
      // Dynamically import to avoid blocking
      const cocoSsd = await import('@tensorflow-models/coco-ssd');
      await import('@tensorflow/tfjs');
      
      const model = await cocoSsd.load();
      setDetectionStatus('Detection active');
      startDetection(model);
    } catch (err) {
      console.error('Failed to load detection model:', err);
      setDetectionStatus('Detection unavailable');
    }
  };

  const startDetection = (model: ObjectDetectionModel) => {
    if (!enabled || !model) return;

    detectionIntervalRef.current = setInterval(async () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        try {
          const predictions: DetectedObject[] = await model.detect(videoRef.current);
          
          // Check for multiple persons
          const persons = predictions.filter((p: DetectedObject) => p.class === 'person');
          if (persons.length > 1) {
            setDetectionStatus('⚠️ Multiple persons detected!');
            if (onCheatDetected) {
              onCheatDetected('Multiple persons detected in camera view');
            }
            return;
          }
          
          // Check for cell phone
          const cellPhone = predictions.find((p: DetectedObject) => p.class === 'cell phone');
          if (cellPhone) {
            setDetectionStatus('⚠️ Cell phone detected!');
            if (onCheatDetected) {
              onCheatDetected('Cell phone detected in camera view');
            }
            return;
          }
          
          // Check if no person is detected
          if (persons.length === 0) {
            setDetectionStatus('⚠️ No person detected!');
            if (onCheatDetected) {
              onCheatDetected('No person detected - student may have left');
            }
            return;
          }
          
          // All good
          setDetectionStatus('✓ Normal - 1 person detected');
        } catch (err) {
          console.error('Detection error:', err);
        }
      }
    }, 3000); // Check every 3 seconds
  };

  const stopDetection = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.drag-handle')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      // Keep within bounds
      const maxX = window.innerWidth - (isExpanded ? 384 : 256);
      const maxY = window.innerHeight - (isExpanded ? 288 : 192);
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  const sizeClass = isExpanded ? 'w-96 h-72' : 'w-64 h-48';

  return (
    <div
      ref={containerRef}
      className={`fixed ${sizeClass} z-50 transition-all duration-300`}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-300 shadow-2xl">
        {isActive ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            
            {/* Drag Handle */}
            <div className="drag-handle absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/70 to-transparent cursor-grab active:cursor-grabbing flex items-center justify-between px-2">
              <div className="flex items-center gap-1 text-white text-xs font-medium">
                <Camera className="h-3 w-3" />
                <span>Drag to move</span>
              </div>
              <button
                onClick={toggleExpand}
                className="text-white hover:text-green-400 transition-colors p-1"
                title={isExpanded ? 'Minimize' : 'Maximize'}
              >
                {isExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
              </button>
            </div>

            {/* Live Indicator */}
            <div className="absolute top-10 right-2 flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium pointer-events-none">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>Live</span>
            </div>

            {/* Detection Status */}
            {enabled && detectionStatus && (
              <div className={`absolute bottom-2 left-2 right-2 px-2 py-1 rounded text-xs font-medium pointer-events-none ${
                detectionStatus.includes('✓') || detectionStatus.includes('active') || detectionStatus.includes('Initializing')
                  ? 'bg-green-600 text-white' 
                  : 'bg-red-600 text-white flex items-center gap-1'
              }`}>
                {detectionStatus.includes('⚠️') && <AlertTriangle className="h-3 w-3 flex-shrink-0" />}
                <span className="truncate">{detectionStatus}</span>
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <CameraOff className="h-12 w-12 mb-2 opacity-50" />
            <p className="text-sm opacity-75">Camera not active</p>
          </div>
        )}
      </div>
    </div>
  );
}