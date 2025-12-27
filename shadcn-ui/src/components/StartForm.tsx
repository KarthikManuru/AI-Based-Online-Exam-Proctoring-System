import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Camera, CheckCircle2, XCircle } from 'lucide-react';
import { getExamConfig, getAttemptByStudentId, createAttempt, allocateQuestionSet } from '@/lib/api';
import { getQuestionSetForStudent } from '@/data/questions';
import { requestCameraPermission, checkCameraAvailability } from '@/lib/camera';
import { Question } from '@/lib/types';
import PrivacyConsentModal from './PrivacyConsentModal';
import CameraPreview from './CameraPreview';

interface StartFormProps {
  onStart: (attemptId: string, questionSet: 'A' | 'B' | 'C' | 'D', questions: Question[]) => void;
}

export default function StartForm({ onStart }: StartFormProps) {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [examOpen, setExamOpen] = useState(false);
  const [proctoredMode, setProctoredMode] = useState(false);
  const [cameraGranted, setCameraGranted] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [cameraAvailable, setCameraAvailable] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExamStatus();
  }, []);

  const loadExamStatus = async () => {
    try {
      const config = await getExamConfig();
      setExamOpen(config.examOpen);
      setProctoredMode(config.proctoredMode);

      if (config.proctoredMode) {
        const available = await checkCameraAvailability();
        setCameraAvailable(available);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error loading exam status:', err);
      setError('Failed to load exam status. Please refresh the page.');
      setLoading(false);
    }
  };

  const handleCameraConsent = async () => {
    const granted = await requestCameraPermission();
    setCameraGranted(granted);
    setShowConsentModal(false);

    if (!granted) {
      setError('Camera access is required for this proctored exam. Please grant camera permission and try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name.trim() || !studentId.trim() || !email.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (!examOpen) {
      setError('The exam is not currently available. Please wait for the administrator to open the exam.');
      return;
    }

    if (proctoredMode && !cameraGranted) {
      setError('Camera access is required for this proctored exam.');
      return;
    }

    try {
      // Check if student ID already exists
      const existingAttempt = await getAttemptByStudentId(studentId.trim());
      if (existingAttempt) {
        setError('This Student ID has already attempted the quiz. Only one attempt is allowed per student.');
        return;
      }

      // Allocate question set
      const questionSet = await allocateQuestionSet();
      const questionsData = getQuestionSetForStudent(questionSet);

      if (!questionsData) {
        setError('Failed to load questions. Please try again.');
        return;
      }

      // Create attempt
      const attemptId = `attempt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const attempt = {
        id: attemptId,
        name: name.trim(),
        email: email.trim(),
        studentId: studentId.trim(),
        questionSet,
        responses: [],
        answers: Array(10).fill(-1),
        score: 0,
        totalQuestions: 10,
        cheated: false,
        cheatCount: 0,
        status: 'in-progress' as const,
        startedAt: new Date(),
        endedAt: null,
        timeRemaining: 600, // 10 minutes in seconds
      };

      await createAttempt(attempt);

      // Start quiz
      onStart(attemptId, questionSet, questionsData.questions);
    } catch (err) {
      console.error('Error starting quiz:', err);
      setError('Failed to start quiz. Please try again.');
    }
  };

  const handleRequestCamera = () => {
    setShowConsentModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-black">Loading exam status...</p>
        </div>
      </div>
    );
  }

  const canStart = examOpen && (!proctoredMode || cameraGranted);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <Card className="w-full max-w-md border-gray-300 shadow-lg">
        <CardHeader className="text-center border-b border-gray-200">
          <CardTitle className="text-2xl font-bold text-black">CSE Department Event Quiz</CardTitle>
          <CardDescription className="text-gray-700">
            Enter your details to begin the quiz
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {!examOpen && (
            <Alert className="mb-4 border-yellow-300 bg-yellow-50">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-black">
                The exam is not currently available. Please wait for the administrator to open the exam window.
              </AlertDescription>
            </Alert>
          )}

          {proctoredMode && !cameraAvailable && (
            <Alert className="mb-4 border-red-300 bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-black">
                No camera detected on your device. This exam requires a webcam. Please use a device with a camera or contact the administrator.
              </AlertDescription>
            </Alert>
          )}

          {proctoredMode && cameraAvailable && (
            <Alert className="mb-4 border-blue-300 bg-blue-50">
              <Camera className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-black">
                <p className="font-semibold mb-1">Proctored Exam Mode</p>
                <p className="text-sm">This exam requires camera access. You must grant camera permission before starting.</p>
              </AlertDescription>
            </Alert>
          )}

          {proctoredMode && cameraGranted && (
            <div className="mb-4">
              <CameraPreview />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-black">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-gray-300 text-black"
                disabled={!examOpen}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentId" className="text-black">Student ID</Label>
              <Input
                id="studentId"
                type="text"
                placeholder="Enter your student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="border-gray-300 text-black"
                disabled={!examOpen}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-black">Institute Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@institute.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-gray-300 text-black"
                disabled={!examOpen}
              />
            </div>

            {error && (
              <Alert variant="destructive" className="border-red-300 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-black">{error}</AlertDescription>
              </Alert>
            )}

            {proctoredMode && !cameraGranted && cameraAvailable && examOpen && (
              <Button
                type="button"
                onClick={handleRequestCamera}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Camera className="mr-2 h-4 w-4" />
                Grant Camera Access
              </Button>
            )}

            <Button
              type="submit"
              disabled={!canStart}
              className="w-full bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-300 disabled:text-gray-500"
            >
              {canStart ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Start Quiz
                </>
              ) : (
                'Start Quiz (Unavailable)'
              )}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-600 text-center">
              • 10 questions • 10 minutes • One attempt only
            </p>
          </div>
        </CardContent>
      </Card>

      <PrivacyConsentModal
        open={showConsentModal}
        onConsent={handleCameraConsent}
        onDecline={() => setShowConsentModal(false)}
      />
    </div>
  );
}