import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, X } from 'lucide-react';

interface CheatOverlayProps {
  onUnlock: () => void;
  correctCode: string;
}

export default function CheatOverlay({ onUnlock, correctCode }: CheatOverlayProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [unlocked, setUnlocked] = useState(false);

  const handleUnlock = () => {
    if (code.trim() === correctCode) {
      setUnlocked(true);
      setError('');
    } else {
      setError('Incorrect admin code. Please contact the administrator.');
      setCode('');
    }
  };

  const handleClose = () => {
    onUnlock();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 relative">
        {unlocked && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        )}

        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-black mb-2">Quiz Locked</h2>
          <p className="text-gray-700">
            Suspicious activity detected. Your quiz has been locked.
          </p>
        </div>

        <Alert className="mb-4 border-red-300 bg-red-50">
          <AlertDescription className="text-black text-sm">
            <p className="font-semibold mb-2">Violations detected:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Tab switching or window focus loss</li>
              <li>Right-click or context menu usage</li>
              <li>Copy/paste attempts</li>
              <li>Keyboard shortcuts for developer tools</li>
            </ul>
          </AlertDescription>
        </Alert>

        {!unlocked ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adminCode" className="text-black">
                Admin Reset Code
              </Label>
              <Input
                id="adminCode"
                type="text"
                placeholder="Enter admin code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                className="border-gray-300 text-black"
                autoFocus
              />
            </div>

            {error && (
              <Alert variant="destructive" className="border-red-300 bg-red-50">
                <AlertDescription className="text-black text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleUnlock}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Unlock Quiz
            </Button>

            <p className="text-xs text-gray-600 text-center">
              Contact your administrator to get the unlock code. Your progress has been saved.
            </p>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <Alert className="border-green-300 bg-green-50">
              <AlertDescription className="text-black">
                <p className="font-semibold mb-1">Quiz Unlocked</p>
                <p className="text-sm">Click the X button above to resume your quiz. Please avoid further violations.</p>
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
}