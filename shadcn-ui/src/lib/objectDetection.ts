// Object detection utilities using TensorFlow.js
// This file provides lazy loading for the detection model

import type { ObjectDetectionModel, DetectedObject } from './types';

export async function loadModel(): Promise<ObjectDetectionModel | null> {
  try {
    const cocoSsd = await import('@tensorflow-models/coco-ssd');
    await import('@tensorflow/tfjs');
    const model = await cocoSsd.load();
    return model;
  } catch (error) {
    console.error('Error loading detection model:', error);
    return null;
  }
}

export async function detectObjects(
  videoElement: HTMLVideoElement, 
  model: ObjectDetectionModel | null
): Promise<DetectedObject[]> {
  if (!model) return [];
  
  try {
    const predictions = await model.detect(videoElement);
    return predictions;
  } catch (error) {
    console.error('Error detecting objects:', error);
    return [];
  }
}

export function checkForCheating(predictions: DetectedObject[]): {
  isCheating: boolean;
  reason: string;
} {
  // Check for multiple persons
  const persons = predictions.filter(p => p.class === 'person');
  if (persons.length > 1) {
    return {
      isCheating: true,
      reason: 'Multiple persons detected in camera view'
    };
  }
  
  // Check for cell phone
  const cellPhone = predictions.find(p => p.class === 'cell phone');
  if (cellPhone) {
    return {
      isCheating: true,
      reason: 'Cell phone detected in camera view'
    };
  }
  
  // Check if no person is detected (student left)
  if (persons.length === 0) {
    return {
      isCheating: true,
      reason: 'No person detected - student may have left'
    };
  }
  
  return {
    isCheating: false,
    reason: ''
  };
}