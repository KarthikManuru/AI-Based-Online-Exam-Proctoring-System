import { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { Camera, CameraOff, Maximize2, Minimize2, AlertTriangle, Smartphone, Users, ScanFace } from 'lucide-react';
import { getCurrentStream, requestCameraPermission } from '@/lib/camera';
import type { ObjectDetectionModel, DetectedObject } from '@/lib/types';

interface DraggableCameraPreviewProps {
  onCheatDetected?: (reason: string) => void;
  enabled?: boolean;
}

export default function DraggableCameraPreview({ onCheatDetected, enabled = true }: DraggableCameraPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const nodeRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [detectionStatus, setDetectionStatus] = useState<string>('Initializing...');
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastCheatTime = useRef<number>(0);

  const lastFacePosition = useRef<{ x: number, y: number } | null>(null);
  const movementWarnings = useRef<number>(0);

  useEffect(() => {
    const initCamera = async () => {
      let stream = getCurrentStream();

      if (!stream) {
        console.log('Stream lost, attempting to recover...');
        const granted = await requestCameraPermission();
        if (granted) {
          stream = getCurrentStream();
        }
      }

      if (stream && videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsActive(true);

        if (enabled) {
          loadDetectionModel();
        }
      } else {
        setIsActive(false);
      }
    };

    initCamera();

    return () => {
      stopDetection();
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [enabled]);

  const loadDetectionModel = async () => {
    try {
      const cocoSsd = await import('@tensorflow-models/coco-ssd');
      await import('@tensorflow/tfjs');

      const model = await cocoSsd.load();
      setDetectionStatus('AI Monitoring Active');
      startDetection(model);
    } catch (err) {
      console.error('Failed to load detection model:', err);
      setDetectionStatus('AI features unavailable');
    }
  };

  const reportCheat = (reason: string) => {
    const now = Date.now();
    if (now - lastCheatTime.current > 5000) {
      lastCheatTime.current = now;
      if (onCheatDetected) {
        onCheatDetected(reason);
      }
    }
  };

  const startDetection = (model: ObjectDetectionModel) => {
    if (!enabled || !model) return;

    detectionIntervalRef.current = setInterval(async () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        try {
          const predictions: DetectedObject[] = await model.detect(videoRef.current);

          const persons = predictions.filter((p: DetectedObject) => p.class === 'person');
          if (persons.length > 1) {
            setDetectionStatus('⚠️ Multiple persons detected!');
            reportCheat('Multiple people detected in view');
            return;
          }

          const forbiddenObjects = predictions.filter((p: DetectedObject) =>
            ['cell phone', 'laptop', 'remote'].includes(p.class)
          );

          if (forbiddenObjects.length > 0) {
            const objName = forbiddenObjects[0].class;
            setDetectionStatus(`⚠️ ${objName} detected!`);
            reportCheat(`Electronic device (${objName}) detected`);
            return;
          }

          if (persons.length === 0) {
            setDetectionStatus('⚠️ No student detected!');
            reportCheat('Student left camera view');
            return;
          }

          const person = persons[0];
          const [x, y, w, h] = person.bbox;
          const centerX = x + w / 2;
          const centerY = y + h / 2;

          if (lastFacePosition.current) {
            const dist = Math.sqrt(
              Math.pow(centerX - lastFacePosition.current.x, 2) +
              Math.pow(centerY - lastFacePosition.current.y, 2)
            );

            if (dist > 100) {
              movementWarnings.current += 1;
              if (movementWarnings.current > 2) {
                setDetectionStatus('⚠️ Suspicious movement');
                reportCheat('Suspicious head/eye movement detected');
                movementWarnings.current = 0;
              }
            } else {
              if (movementWarnings.current > 0) movementWarnings.current--;
            }
          }
          lastFacePosition.current = { x: centerX, y: centerY };

          setDetectionStatus('✓ Monitoring Secure');
        } catch (err) {
          console.error('Detection error:', err);
        }
      }
    }, 1000);
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

  const sizeClass = isExpanded ? 'w-96 h-72' : 'w-64 h-48';

  return (
    <Draggable nodeRef={nodeRef} handle=".drag-handle" bounds="window">
      <div
        ref={nodeRef}
        className={`fixed z-50 shadow-2xl rounded-lg overflow-hidden border-2 border-gray-300 ${sizeClass}`}
        style={{ right: 20, top: 80 }}
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

              <div className="drag-handle absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/70 to-transparent cursor-grab active:cursor-grabbing flex items-center justify-between px-2 z-10 transition-colors hover:bg-black/30">
                <div className="flex items-center gap-1 text-white text-xs font-medium">
                  <Camera className="h-3 w-3" />
                  <span>Proctor View</span>
                </div>
                <button
                  onClick={toggleExpand}
                  className="text-white hover:text-green-400 transition-colors p-1"
                  title={isExpanded ? 'Minimize' : 'Maximize'}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  {isExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
                </button>
              </div>

              <div className="absolute top-10 right-2 flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium pointer-events-none">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span>Live</span>
              </div>

              {enabled && detectionStatus && (
                <div className={`absolute bottom-2 left-2 right-2 px-2 py-1 rounded text-xs font-medium pointer-events-none transition-colors duration-300 ${detectionStatus.includes('✓')
                    ? 'bg-green-600/90 text-white'
                    : detectionStatus.includes('Initializing')
                      ? 'bg-gray-600/90 text-white'
                      : 'bg-red-600/90 text-white animate-pulse'
                  }`}>
                  <div className="flex items-center gap-2">
                    {detectionStatus.includes('✓') && <ScanFace className="h-3 w-3" />}
                    {detectionStatus.includes('Multiple') && <Users className="h-3 w-3" />}
                    {detectionStatus.includes('Phone') && <Smartphone className="h-3 w-3" />}
                    {detectionStatus.includes('⚠️') && !detectionStatus.includes('Phone') && !detectionStatus.includes('Multiple') && <AlertTriangle className="h-3 w-3" />}

                    <span className="truncate flex-1">{detectionStatus}</span>
                  </div>
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
    </Draggable>
  );
}