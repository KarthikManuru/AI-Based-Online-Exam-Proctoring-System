import { useState, useEffect } from 'react';

import { stopCamera } from '@/lib/camera';
import { Question } from '@/lib/types';
import StartForm from '@/components/StartForm';
import Quiz from '@/components/Quiz';
import ResultScreen from '@/components/ResultScreen';

type HomeState = 'start' | 'quiz' | 'result';

export default function Home() {
  const [state, setState] = useState<HomeState>('start');
  const [attemptId, setAttemptId] = useState('');
  const [questionSet, setQuestionSet] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);


  useEffect(() => {
    return () => stopCamera();
  }, []);

  const handleStart = (
    id: string,
    set: 'A' | 'B' | 'C' | 'D',
    qs: Question[]
  ) => {
    setAttemptId(id);
    setQuestionSet(set);
    setQuestions(qs);
    setState('quiz');
  };

  const handleComplete = (s: number, t: number) => {
    setScore(s);
    setTotal(t);
    stopCamera();
    setState('result');
  };

  const handleBackToHome = () => {
    stopCamera();
    setState('start');
  };



  return (
    <>
      {state === 'start' && <StartForm onStart={handleStart} />}

      {state === 'quiz' && (
        <Quiz
          attemptId={attemptId}
          questionSet={questionSet}
          questions={questions}
          onComplete={handleComplete}
        />
      )}

      {state === 'result' && (
        <ResultScreen
          attemptId={attemptId}
          score={score}
          total={total}
          onBackToHome={handleBackToHome}
        />
      )}
    </>
  );
}
