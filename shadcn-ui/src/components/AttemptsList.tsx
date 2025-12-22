import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CheckCircle2, XCircle, AlertTriangle, Eye, Trash2 } from 'lucide-react';
import { Attempt, AttemptResponse } from '@/lib/types';

interface AttemptsListProps {
  attempts: Attempt[];
  onRefresh: () => void;
  onDelete?: (attemptId: string, studentId: string) => void;
}

export default function AttemptsList({ attempts, onDelete }: AttemptsListProps) {
  const [selectedAttempt, setSelectedAttempt] = useState<Attempt | null>(null);
  const [deleteAttempt, setDeleteAttempt] = useState<Attempt | null>(null);

  const getStatusBadge = (status: string) => {
    if (status === 'submitted') {
      return <Badge className="bg-green-600 text-white">Completed</Badge>;
    }
    return <Badge className="bg-blue-600 text-white">In Progress</Badge>;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  const handleDelete = () => {
    if (deleteAttempt && onDelete) {
      onDelete(deleteAttempt.id, deleteAttempt.studentId);
      setDeleteAttempt(null);
    }
  };

  return (
    <>
      <div className="rounded-lg border border-gray-300 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="text-black">Name</TableHead>
              <TableHead className="text-black">Student ID</TableHead>
              <TableHead className="text-black">Set</TableHead>
              <TableHead className="text-black">Score</TableHead>
              <TableHead className="text-black">Status</TableHead>
              <TableHead className="text-black">Flagged</TableHead>
              <TableHead className="text-black">Started</TableHead>
              <TableHead className="text-black">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attempts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                  No attempts yet
                </TableCell>
              </TableRow>
            ) : (
              attempts.map((attempt) => (
                <TableRow key={attempt.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-black">{attempt.name}</TableCell>
                  <TableCell className="text-black">{attempt.studentId}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-blue-600 text-blue-600">
                      {attempt.questionSet}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-black">
                    {attempt.status === 'submitted' ? (
                      <span className="font-semibold">
                        {attempt.score}/{attempt.totalQuestions}
                      </span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(attempt.status)}</TableCell>
                  <TableCell>
                    {attempt.cheated ? (
                      <div className="flex items-center gap-1 text-red-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-xs">Yes ({attempt.cheatCount})</span>
                      </div>
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {formatDate(attempt.startedAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => setSelectedAttempt(attempt)}
                        size="sm"
                        variant="outline"
                        className="border-gray-300 text-black hover:bg-gray-100"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      {onDelete && (
                        <Button
                          onClick={() => setDeleteAttempt(attempt)}
                          size="sm"
                          variant="outline"
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Attempt Details Dialog */}
      <Dialog open={!!selectedAttempt} onOpenChange={() => setSelectedAttempt(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-black">Attempt Details</DialogTitle>
            <DialogDescription className="text-gray-700">
              Complete information for this quiz attempt
            </DialogDescription>
          </DialogHeader>

          {selectedAttempt && (
            <div className="space-y-4">
              {/* Student Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold text-black">{selectedAttempt.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Student ID</p>
                  <p className="font-semibold text-black">{selectedAttempt.studentId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-black">{selectedAttempt.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Question Set</p>
                  <p className="font-semibold text-black">{selectedAttempt.questionSet}</p>
                </div>
              </div>

              {/* Score & Status */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-600 mb-1">Score</p>
                  <p className="text-2xl font-bold text-green-600">
                    {selectedAttempt.status === 'submitted'
                      ? `${selectedAttempt.score}/${selectedAttempt.totalQuestions}`
                      : 'N/A'}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <p className="text-sm font-semibold text-black">{selectedAttempt.status}</p>
                </div>
                <div className={`p-4 rounded-lg border ${
                  selectedAttempt.cheated
                    ? 'bg-red-50 border-red-200'
                    : 'bg-green-50 border-green-200'
                }`}>
                  <p className="text-sm text-gray-600 mb-1">Integrity</p>
                  <p className="text-sm font-semibold text-black">
                    {selectedAttempt.cheated ? `Flagged (${selectedAttempt.cheatCount})` : 'Clean'}
                  </p>
                </div>
              </div>

              {/* Timestamps */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Started At</p>
                    <p className="font-semibold text-black">{formatDate(selectedAttempt.startedAt)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Ended At</p>
                    <p className="font-semibold text-black">
                      {selectedAttempt.endedAt ? formatDate(selectedAttempt.endedAt) : 'In Progress'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Responses */}
              {selectedAttempt.responses && selectedAttempt.responses.length > 0 && (
                <div>
                  <h3 className="font-semibold text-black mb-3">Detailed Responses</h3>
                  <div className="space-y-3">
                    {selectedAttempt.responses.map((response: AttemptResponse, index: number) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${
                          response.isCorrect
                            ? 'border-green-200 bg-green-50'
                            : 'border-red-200 bg-red-50'
                        }`}
                      >
                        <div className="flex items-start gap-2 mb-2">
                          {response.isCorrect ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          )}
                          <p className="text-sm font-semibold text-black">
                            Q{index + 1}: {response.question}
                          </p>
                        </div>
                        <div className="ml-6 text-sm space-y-1">
                          <p className="text-gray-700">
                            <span className="font-semibold">Student's answer:</span>{' '}
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
                    ))}
                  </div>
                </div>
              )}

              {/* Attempt ID */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-600">
                  Attempt ID: <code className="bg-gray-100 px-2 py-1 rounded text-black">{selectedAttempt.id}</code>
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteAttempt} onOpenChange={() => setDeleteAttempt(null)}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-black">Delete Attempt?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-700">
              {deleteAttempt && (
                <>
                  This will permanently delete the attempt for <strong>{deleteAttempt.name}</strong> (Student ID: <strong>{deleteAttempt.studentId}</strong>).
                  The student will be able to re-attempt the quiz. This action cannot be undone.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300 text-black hover:bg-gray-100">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Attempt
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}