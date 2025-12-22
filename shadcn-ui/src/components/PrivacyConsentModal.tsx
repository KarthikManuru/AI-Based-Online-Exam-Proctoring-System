import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import { Camera, Shield, AlertCircle } from 'lucide-react';

interface PrivacyConsentModalProps {
  open: boolean;
  onConsent: () => void;
  onDecline: () => void;
}

export default function PrivacyConsentModal({ open, onConsent, onDecline }: PrivacyConsentModalProps) {
  const [agreed, setAgreed] = useState(false);

  const handleConsent = () => {
    if (agreed) {
      onConsent();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onDecline()}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-black">
            <Camera className="h-5 w-5 text-blue-600" />
            Proctored Exam - Camera Access Required
          </DialogTitle>
          <DialogDescription className="text-gray-700">
            Please read and accept the following terms to continue
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-black">
              <p className="font-semibold mb-2">Privacy Notice</p>
              <p>This exam requires camera access for proctoring purposes. By continuing, you agree that:</p>
            </div>
          </div>

          <ul className="space-y-2 text-sm text-black ml-4">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span>Your webcam will be activated during the exam</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span>Live video preview will be shown to ensure camera is working</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span>Camera access is used solely for exam integrity purposes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span>No video recordings are stored permanently</span>
            </li>
          </ul>

          <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-black">
              <p className="font-semibold mb-1">Important</p>
              <p>If you decline camera access, you will not be able to start the exam. Please ensure your camera is working before proceeding.</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
              id="consent" 
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
            />
            <label
              htmlFor="consent"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black cursor-pointer"
            >
              I have read and agree to the camera usage terms
            </label>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={onDecline}
            className="border-gray-300 text-black hover:bg-gray-100"
          >
            Decline
          </Button>
          <Button 
            onClick={handleConsent}
            disabled={!agreed}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Accept & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}