import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trophy, CheckCircle2, XCircle, AlertTriangle, Home } from 'lucide-react';
import { getAttemptById } from '@/lib/api';
import { Attempt, AttemptResponse } from '@/lib/types';

interface ResultScreenProps {
  attemptId: string;
  score: number;
  total: number;
  onBackToHome: () => void;
}

export default function ResultScreen({ attemptId, score, total, onBackToHome }: ResultScreenProps) {
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAttempt();
  }, []);

  const loadAttempt = async () => {
    try {
      const data = await getAttemptById(attemptId);
      setAttempt(data || null);
      setLoading(false);
    } catch (err) {
      console.error('Error loading attempt:', err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-black">Loading results...</p>
        </div>
      </div>
    );
  }

  const percentage = Math.round((score / total) * 100);
  const passed = percentage >= 60;

  const getRemark = () => {
    if (percentage >= 90) return 'Outstanding! 🌟';
    if (percentage >= 80) return 'Excellent work! 🎉';
    if (percentage >= 70) return 'Great job! 👏';
    if (percentage >= 60) return 'Good effort! 👍';
    return 'Keep practicing! 💪';
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-6">
        {/* Result Summary Card */}
        <Card className="border-gray-300 shadow-lg">
          <CardHeader className="text-center border-b border-gray-200 pb-6">
            <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${passed ? 'bg-green-100' : 'bg-yellow-100'
              }`}>
              <Trophy className={`h-10 w-10 ${passed ? 'text-green-600' : 'text-yellow-600'}`} />
            </div>
            <CardTitle className="text-3xl font-bold text-black mb-2">
              Quiz Completed!
            </CardTitle>
            <p className="text-gray-700">{getRemark()}</p>
          </CardHeader>

          <CardContent className="pt-6">
            {/* Score Display */}
            <div className="text-center mb-6">
              <div className="text-6xl font-bold text-black mb-2">
                {score}<span className="text-3xl text-gray-500">/{total}</span>
              </div>
              <div className="text-2xl font-semibold text-gray-700">
                {percentage}%
              </div>
            </div>

            {/* Student Info */}
            {attempt && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <span className="ml-2 font-semibold text-black">{attempt.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Student ID:</span>
                    <span className="ml-2 font-semibold text-black">{attempt.studentId}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <span className="ml-2 font-semibold text-black">{attempt.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Question Set:</span>
                    <span className="ml-2 font-semibold text-black">{attempt.questionSet}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Cheating Warning */}
            {attempt?.cheated && (
              <Alert className="mb-6 border-red-300 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-black">
                  <p className="font-semibold">Integrity Violation Detected</p>
                  <p className="text-sm mt-1">
                    This attempt was flagged for {attempt.cheatCount} violation(s). This may affect your final evaluation.
                  </p>
                </AlertDescription>
              </Alert>
            )}

            {/* Performance Breakdown */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-black">Correct</span>
                </div>
                <div className="text-3xl font-bold text-green-600">{score}</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="font-semibold text-black">Incorrect</span>
                </div>
                <div className="text-3xl font-bold text-red-600">{total - score}</div>
              </div>
            </div>

            <Button
              onClick={onBackToHome}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>

            <p className="text-xs text-gray-600 text-center mt-4">
              Your results have been recorded. Contact the administrator for any queries.
            </p>
          </CardContent>
        </Card>

        {/* Detailed Responses */}
        {attempt?.responses && (
          <Card className="border-gray-300">
            <CardHeader>
              <CardTitle className="text-xl text-black">Detailed Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {attempt.responses.map((response: AttemptResponse, index: number) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${response.isCorrect
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                    }`}
                >
                  <div className="flex items-start gap-3 mb-2">
                    {response.isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-black mb-2">
                        Question {index + 1}: {response.question}
                      </p>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-700">
                          <span className="font-semibold">Your answer:</span>{' '}
                          {response.chosenIndex === -1
                            ? 'Not answered'
                            : response.options[response.chosenIndex]}
                        </p>
                        {!response.isCorrect && (
                          <p className="text-gray-700">
                            <span className="font-semibold">Correct answer:</span>{' '}
                            {response.options[response.correctIndex]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}