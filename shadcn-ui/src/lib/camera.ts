// Camera/Proctoring utilities

export interface CameraConfig {
  enabled: boolean;
  onPermissionGranted?: () => void;
  onPermissionDenied?: () => void;
}

let currentStream: MediaStream | null = null;

export async function requestCameraPermission(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        width: { ideal: 640 },
        height: { ideal: 480 }
      } 
    });
    currentStream = stream;
    return true;
  } catch (error) {
    console.error('Camera permission denied:', error);
    return false;
  }
}

export function getCurrentStream(): MediaStream | null {
  return currentStream;
}

export function stopCamera() {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
    currentStream = null;
  }
}

export async function checkCameraAvailability(): Promise<boolean> {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.some(device => device.kind === 'videoinput');
  } catch (error) {
    console.error('Error checking camera availability:', error);
    return false;
  }
}

// Capture snapshot from video stream
export function captureSnapshot(videoElement: HTMLVideoElement): string | null {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    ctx.drawImage(videoElement, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.8);
  } catch (error) {
    console.error('Error capturing snapshot:', error);
    return null;
  }
}