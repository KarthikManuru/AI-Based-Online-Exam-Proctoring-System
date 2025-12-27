import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getAttemptById, updateAttempt, getExamConfig } from '@/lib/api';
import { validateAnswers } from '@/data/questions';
import {
  setupAntiCheat,
  cleanupAntiCheat,
  preventTextSelection,
  allowTextSelection,
  CheatEvent,
} from '@/lib/antiCheat';
import CheatOverlay from './CheatOverlay';
import DraggableCameraPreview from './DraggableCameraPreview';
import SideQuestionBar from './SideQuestionBar';

interface QuizProps {
  attemptId: string;
  questionSet: 'A' | 'B' | 'C' | 'D';
  questions: Array<{
    id: string;
    question: string;
    options: string[];
  }>;
  onComplete: (score: number, total: number) => void;
}

export default function Quiz({
  attemptId,
  questionSet,
  questions,
  onComplete,
}: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(600);
  const [showCheatOverlay, setShowCheatOverlay] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [proctoredMode, setProctoredMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /* =======================
     NORMALIZE ANSWERS LENGTH
     ======================= */
  useEffect(() => {
    if (questions.length === 0) return;

    setAnswers((prev) => {
      const normalized = Array(questions.length).fill(-1);
      for (let i = 0; i < Math.min(prev.length, questions.length); i++) {
        normalized[i] = prev[i];
      }
      return normalized;
    });
  }, [questions]);

  /* =======================
     INITIAL LOAD
     ======================= */
  useEffect(() => {
    loadAttemptData();
    loadExamConfig();
    preventTextSelection();

    return () => {
      allowTextSelection();
      cleanupAntiCheat();
    };
  }, []);

  const loadAttemptData = async () => {
    try {
      const attempt = await getAttemptById(attemptId);
      if (attempt?.answers) {
        setAnswers(attempt.answers);
        setTimeRemaining(attempt.timeRemaining);
      }
    } catch (err) {
      console.error('Error loading attempt:', err);
    }
  };

  const loadExamConfig = async () => {
    try {
      const config = await getExamConfig();
      setAdminCode(config.adminResetCode);
      setProctoredMode(config.proctoredMode);
    } catch (err) {
      console.error('Error loading config:', err);
    }
  };

  /* =======================
     ANTI-CHEAT
     ======================= */
  const handleCheatDetected = useCallback(
    async (event: CheatEvent | string) => {
      console.log('Cheat detected:', event);
      try {
        const attempt = await getAttemptById(attemptId);
        if (attempt && !attempt.cheated) {
          await updateAttempt(attemptId, {
            cheated: true,
            cheatCount: attempt.cheatCount + 1,
          });
        }
        setShowCheatOverlay(true);
      } catch (err) {
        console.error('Error flagging cheat:', err);
      }
    },
    [attemptId]
  );

  useEffect(() => {
    if (!showCheatOverlay) {
      setupAntiCheat({ onCheatDetected: handleCheatDetected, enabled: true });
    } else {
      cleanupAntiCheat();
    }
    return () => cleanupAntiCheat();
  }, [showCheatOverlay, handleCheatDetected]);

  /* =======================
     TIMER
     ======================= */
  useEffect(() => {
    if (showCheatOverlay || submitting) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showCheatOverlay, submitting]);

  /* =======================
     EXAM STATUS POLLING
     ======================= */
  useEffect(() => {
    if (submitting) return;

    const pollInterval = setInterval(async () => {
      try {
        const config = await getExamConfig();
        if (!config.examOpen) {
          console.log('Exam closed by admin. Auto-submitting...');
          // Use a flag or alert to let user know? Maybe just submit.
          handleSubmit();
        }
      } catch (err) {
        console.error('Error polling exam status:', err);
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(pollInterval);
  }, [submitting]);

  /* =======================
     AUTO SAVE
     ======================= */
  useEffect(() => {
    const t = setTimeout(() => {
      updateAttempt(attemptId, { answers, timeRemaining }).catch(console.error);
    }, 1000);
    return () => clearTimeout(t);
  }, [answers, timeRemaining, attemptId]);

  /* =======================
     ANSWER HANDLER
     ======================= */
  const handleAnswerSelect = (optionIndex: number) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[currentQuestion] = optionIndex;
      return updated;
    });
  };

  /* =======================
     SUBMIT
     ======================= */
  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const result = validateAnswers(questionSet, answers);
      if (!result) throw new Error('Validation failed');

      await updateAttempt(attemptId, {
        responses: result.responses,
        score: result.score,
        totalQuestions: result.totalQuestions,
        status: 'submitted',
        endedAt: new Date(),
        answers,
      });

      cleanupAntiCheat();
      allowTextSelection();
      onComplete(result.score, result.totalQuestions);
    } catch (err) {
      console.error(err);
      alert('Failed to submit quiz.');
      setSubmitting(false);
    }
  };

  const answeredCount = answers.filter((a) => a >= 0).length;
  const currentQuestionData = questions[currentQuestion];

  /* =======================
     FULL SCREEN ENFORCEMENT
     ======================= */
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const handleFullScreenChange = () => {
      const isFs = !!document.fullscreenElement;
      setIsFullScreen(isFs);
      if (!isFs && !submitting) {
        handleCheatDetected('Exited Full Screen Mode');
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, [submitting, handleCheatDetected]);

  const enterFullScreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch (err) {
      console.error('Error entering full screen:', err);
    }
  };

  /* =======================
     RENDER
     ======================= */
  if (!currentQuestionData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-black text-lg">Loading quiz...</p>
      </div>
    );
  }

  // Force Full Screen Overlay
  if (!isFullScreen && !submitting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
        <div className="max-w-md text-center space-y-6">
          <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto" />
          <h1 className="text-2xl font-bold">Full Screen Required</h1>
          <p className="text-gray-300">
            This exam relies on cheat detection that requires full screen mode.
            Please enabling full screen to view the questions.
          </p>
          <Button
            onClick={enterFullScreen}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
          >
            Enable Full Screen & Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* HEADER */}
        <div className="border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between">
            <div>
              <h1 className="text-xl font-bold text-black">CSE Department Quiz</h1>
              <p className="text-sm text-gray-600">Question Set: {questionSet}</p>
            </div>
            <div className={`px-4 py-2 rounded-lg ${timeRemaining < 120 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
              <Clock className="inline mr-2 h-5 w-5" />
              <span className="font-mono font-bold">{Math.floor(timeRemaining / 60).toString().padStart(2, '0')}:{(timeRemaining % 60).toString().padStart(2, '0')}</span>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="max-w-7xl mx-auto px-4 py-6 grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <Alert className="border-blue-300 bg-blue-50">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-black">
                <strong>Progress:</strong> {answeredCount} of {questions.length} answered
              </AlertDescription>
            </Alert>

            <Card className="p-6 border-gray-300">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold text-blue-600">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                {answers[currentQuestion] >= 0 && (
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Answered
                  </span>
                )}
              </div>

              <h2 className="text-xl font-semibold text-black mb-4">
                {currentQuestionData.question}
              </h2>

              <div className="space-y-3">
                {currentQuestionData.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full text-left p-4 rounded-lg border-2 ${answers[currentQuestion] === index
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-300 hover:bg-blue-50'
                      }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="flex justify-between mt-6 pt-6 border-t">
                <Button
                  variant="outline"
                  disabled={currentQuestion === 0}
                  onClick={() => setCurrentQuestion((q) => q - 1)}
                >
                  Previous
                </Button>

                {currentQuestion === questions.length - 1 ? (
                  <Button onClick={handleSubmit} className="bg-green-600 text-white">
                    Submit
                  </Button>
                ) : (
                  <Button onClick={() => setCurrentQuestion((q) => q + 1)}>
                    Next
                  </Button>
                )}
              </div>
            </Card>
          </div>

          <SideQuestionBar
            totalQuestions={questions.length}
            currentQuestion={currentQuestion}
            answers={answers}
            onQuestionSelect={setCurrentQuestion}
          />
        </div>
      </div>

      {proctoredMode && !showCheatOverlay && (
        <DraggableCameraPreview onCheatDetected={handleCheatDetected} enabled />
      )}

      {showCheatOverlay && (
        <CheatOverlay onUnlock={() => setShowCheatOverlay(false)} correctCode={adminCode} />
      )}
    </>
  );
}
