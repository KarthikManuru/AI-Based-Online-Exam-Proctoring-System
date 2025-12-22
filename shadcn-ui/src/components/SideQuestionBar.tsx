import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

interface SideQuestionBarProps {
  totalQuestions: number;
  currentQuestion: number;
  answers: number[];
  onQuestionSelect: (index: number) => void;
}

export default function SideQuestionBar({
  totalQuestions,
  currentQuestion,
  answers,
  onQuestionSelect,
}: SideQuestionBarProps) {
  return (
    <Card className="border-gray-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-black">Questions</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: totalQuestions }, (_, index) => {
            // ✅ FIX: only >= 0 is answered
            const isAnswered = answers[index] >= 0;
            const isCurrent = index === currentQuestion;

            return (
              <button
                key={index}
                onClick={() => onQuestionSelect(index)}
                className={`aspect-square rounded-lg border-2 flex items-center justify-center text-sm font-semibold transition-all ${
                  isCurrent
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : isAnswered
                    ? 'border-green-600 bg-green-50 text-green-700 hover:bg-green-100'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                }`}
                title={`Question ${index + 1}${isAnswered ? ' (Answered)' : ''}`}
              >
                {isAnswered && !isCurrent ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-blue-600 bg-blue-600"></div>
            <span className="text-gray-700">Current</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-green-600 bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="h-3 w-3 text-green-700" />
            </div>
            <span className="text-gray-700">Answered</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-gray-300 bg-white"></div>
            <span className="text-gray-700">Unanswered</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
