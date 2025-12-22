import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import {
  Settings,
  Users,
  Activity,
  LogOut,
  CheckCircle2,
  XCircle,
  Camera,
  Key,
  Download,
  Unlock,
  Trash2,
} from 'lucide-react';
import { 
  getExamConfig, 
  updateExamConfig, 
  getAllAttempts, 
  addAdminLog, 
  getAdminLogs, 
  updateAttempt,
  deleteAttempt,
  clearAllAttempts,
  clearAllLogs
} from '@/lib/db';
import { Attempt, AdminLog } from '@/lib/types';
import AttemptsList from './AttemptsList';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [examOpen, setExamOpen] = useState(false);
  const [proctoredMode, setProctoredMode] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [newAdminCode, setNewAdminCode] = useState('');
  const [unlockAttemptId, setUnlockAttemptId] = useState('');
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showClearLogsDialog, setShowClearLogsDialog] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const config = await getExamConfig();
      setExamOpen(config.examOpen);
      setProctoredMode(config.proctoredMode);
      setAdminCode(config.adminResetCode);
      setNewAdminCode(config.adminResetCode);

      const attemptsData = await getAllAttempts();
      setAttempts(attemptsData.sort((a, b) => 
        new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
      ));

      const logsData = await getAdminLogs();
      setLogs(logsData);

      setLoading(false);
    } catch (err) {
      console.error('Error loading data:', err);
      setLoading(false);
    }
  };

  const handleToggleExam = async (open: boolean) => {
    try {
      await updateExamConfig({ examOpen: open });
      await addAdminLog(
        open ? 'Exam Opened' : 'Exam Closed',
        `Admin ${open ? 'opened' : 'closed'} the exam window`
      );
      setExamOpen(open);
      setMessage(`Exam ${open ? 'opened' : 'closed'} successfully`);
      loadData();
    } catch (err) {
      console.error('Error toggling exam:', err);
      setMessage('Failed to update exam status');
    }
  };

  const handleToggleProctored = async (enabled: boolean) => {
    try {
      await updateExamConfig({ proctoredMode: enabled });
      await addAdminLog(
        enabled ? 'Proctored Mode Enabled' : 'Proctored Mode Disabled',
        `Admin ${enabled ? 'enabled' : 'disabled'} proctored mode`
      );
      setProctoredMode(enabled);
      setMessage(`Proctored mode ${enabled ? 'enabled' : 'disabled'} successfully`);
      loadData();
    } catch (err) {
      console.error('Error toggling proctored mode:', err);
      setMessage('Failed to update proctored mode');
    }
  };

  const handleUpdateAdminCode = async () => {
    if (!newAdminCode.trim()) {
      setMessage('Admin code cannot be empty');
      return;
    }

    try {
      await updateExamConfig({ adminResetCode: newAdminCode.trim() });
      await addAdminLog('Admin Code Updated', 'Admin reset code was changed');
      setAdminCode(newAdminCode.trim());
      setMessage('Admin code updated successfully');
      loadData();
    } catch (err) {
      console.error('Error updating admin code:', err);
      setMessage('Failed to update admin code');
    }
  };

  const handleForceUnlock = async () => {
    if (!unlockAttemptId.trim()) {
      setMessage('Please enter an attempt ID');
      return;
    }

    try {
      await updateAttempt(unlockAttemptId.trim(), { cheated: false, cheatCount: 0 });
      await addAdminLog('Force Unlock', `Admin unlocked attempt: ${unlockAttemptId}`);
      setMessage('Attempt unlocked successfully');
      setUnlockAttemptId('');
      loadData();
    } catch (err) {
      console.error('Error unlocking attempt:', err);
      setMessage('Failed to unlock attempt. Check the attempt ID.');
    }
  };

  const handleDeleteAttempt = async (attemptId: string, studentId: string) => {
    try {
      await deleteAttempt(attemptId);
      await addAdminLog('Attempt Deleted', `Admin deleted attempt for student ID: ${studentId}`);
      setMessage('Attempt deleted successfully. Student can now re-attempt the quiz.');
      loadData();
    } catch (err) {
      console.error('Error deleting attempt:', err);
      setMessage('Failed to delete attempt');
    }
  };

  const handleClearAllHistory = async () => {
    try {
      await clearAllAttempts();
      await addAdminLog('All History Cleared', 'Admin cleared all attempt history');
      setMessage('All attempt history cleared successfully');
      setShowClearDialog(false);
      loadData();
    } catch (err) {
      console.error('Error clearing history:', err);
      setMessage('Failed to clear history');
    }
  };

  const handleClearAllLogs = async () => {
    try {
      await clearAllLogs();
      setMessage('All activity logs cleared successfully');
      setShowClearLogsDialog(false);
      loadData();
    } catch (err) {
      console.error('Error clearing logs:', err);
      setMessage('Failed to clear logs');
    }
  };

  const handleExportCSV = () => {
    try {
      const headers = ['Name', 'Student ID', 'Email', 'Question Set', 'Score', 'Total', 'Percentage', 'Cheated', 'Status', 'Started At', 'Ended At'];
      const rows = attempts.map(a => [
        a.name,
        a.studentId,
        a.email,
        a.questionSet,
        a.score,
        a.totalQuestions,
        `${Math.round((a.score / a.totalQuestions) * 100)}%`,
        a.cheated ? 'Yes' : 'No',
        a.status,
        new Date(a.startedAt).toLocaleString(),
        a.endedAt ? new Date(a.endedAt).toLocaleString() : 'In Progress',
      ]);

      const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quiz-attempts-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      setMessage('CSV exported successfully');
    } catch (err) {
      console.error('Error exporting CSV:', err);
      setMessage('Failed to export CSV');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-black">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  const stats = {
    total: attempts.length,
    completed: attempts.filter(a => a.status === 'submitted').length,
    inProgress: attempts.filter(a => a.status === 'in-progress').length,
    cheated: attempts.filter(a => a.cheated).length,
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">CSE Department Event Quiz Management</p>
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
            className="border-gray-300 text-black hover:bg-gray-100"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {message && (
          <Alert className="mb-4 border-blue-300 bg-blue-50">
            <AlertDescription className="text-black">{message}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-gray-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Attempts</p>
                  <p className="text-3xl font-bold text-black">{stats.total}</p>
                </div>
                <Users className="h-10 w-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
                </div>
                <Activity className="h-10 w-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Flagged</p>
                  <p className="text-3xl font-bold text-red-600">{stats.cheated}</p>
                </div>
                <XCircle className="h-10 w-10 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="settings" className="space-y-4">
          <TabsList className="bg-gray-100">
            <TabsTrigger value="settings" className="data-[state=active]:bg-white">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="attempts" className="data-[state=active]:bg-white">
              <Users className="mr-2 h-4 w-4" />
              Attempts
            </TabsTrigger>
            <TabsTrigger value="logs" className="data-[state=active]:bg-white">
              <Activity className="mr-2 h-4 w-4" />
              Activity Logs
            </TabsTrigger>
          </TabsList>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card className="border-gray-300">
              <CardHeader>
                <CardTitle className="text-black">Exam Controls</CardTitle>
                <CardDescription className="text-gray-700">
                  Manage exam availability and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Exam Open/Close */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-1">
                    <h3 className="font-semibold text-black mb-1">Exam Window</h3>
                    <p className="text-sm text-gray-600">
                      {examOpen ? 'Students can currently start the exam' : 'Exam is closed - students cannot start'}
                    </p>
                  </div>
                  <Switch
                    checked={examOpen}
                    onCheckedChange={handleToggleExam}
                    className="data-[state=checked]:bg-green-600"
                  />
                </div>

                {/* Proctored Mode */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-1">
                    <h3 className="font-semibold text-black mb-1 flex items-center gap-2">
                      <Camera className="h-4 w-4" />
                      Proctored Mode
                    </h3>
                    <p className="text-sm text-gray-600">
                      {proctoredMode ? 'Camera access required with AI detection' : 'Camera access not required'}
                    </p>
                  </div>
                  <Switch
                    checked={proctoredMode}
                    onCheckedChange={handleToggleProctored}
                    className="data-[state=checked]:bg-green-600"
                  />
                </div>

                {/* Admin Reset Code */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-black mb-3 flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    Admin Reset Code
                  </h3>
                  <div className="flex gap-2">
                    <Input
                      value={newAdminCode}
                      onChange={(e) => setNewAdminCode(e.target.value)}
                      placeholder="Enter new admin code"
                      className="border-gray-300 text-black"
                    />
                    <Button
                      onClick={handleUpdateAdminCode}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Update
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Current code: <code className="bg-gray-200 px-2 py-1 rounded">{adminCode}</code>
                  </p>
                </div>

                {/* Force Unlock */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-black mb-3 flex items-center gap-2">
                    <Unlock className="h-4 w-4" />
                    Force Unlock Attempt
                  </h3>
                  <div className="flex gap-2">
                    <Input
                      value={unlockAttemptId}
                      onChange={(e) => setUnlockAttemptId(e.target.value)}
                      placeholder="Enter attempt ID"
                      className="border-gray-300 text-black"
                    />
                    <Button
                      onClick={handleForceUnlock}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Unlock
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Remove cheat flags from a specific attempt
                  </p>
                </div>

                {/* Clear All History */}
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <h3 className="font-semibold text-black mb-3 flex items-center gap-2">
                    <Trash2 className="h-4 w-4 text-red-600" />
                    Clear All History
                  </h3>
                  <p className="text-sm text-gray-700 mb-3">
                    Delete all attempt records. Students will be able to re-attempt the quiz. This action cannot be undone.
                  </p>
                  <Button
                    onClick={() => setShowClearDialog(true)}
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear All History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attempts Tab */}
          <TabsContent value="attempts">
            <Card className="border-gray-300">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-black">All Attempts</CardTitle>
                  <CardDescription className="text-gray-700">
                    View and manage student quiz attempts
                  </CardDescription>
                </div>
                <Button
                  onClick={handleExportCSV}
                  variant="outline"
                  className="border-gray-300 text-black hover:bg-gray-100"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </CardHeader>
              <CardContent>
                <AttemptsList 
                  attempts={attempts} 
                  onRefresh={loadData}
                  onDelete={handleDeleteAttempt}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs">
            <Card className="border-gray-300">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-black">Activity Logs</CardTitle>
                  <CardDescription className="text-gray-700">
                    Admin actions and system events
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setShowClearLogsDialog(true)}
                  variant="outline"
                  className="border-gray-300 text-black hover:bg-gray-100"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Logs
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {logs.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No activity logs yet</p>
                  ) : (
                    logs.map((log) => (
                      <div
                        key={log.id}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-start justify-between"
                      >
                        <div>
                          <p className="font-semibold text-black">{log.action}</p>
                          <p className="text-sm text-gray-600">{log.details}</p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Clear All History Confirmation Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-black">Clear All History?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-700">
              This will permanently delete all {stats.total} attempt records. Students will be able to re-attempt the quiz. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300 text-black hover:bg-gray-100">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleClearAllHistory}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Clear All History
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear Logs Confirmation Dialog */}
      <AlertDialog open={showClearLogsDialog} onOpenChange={setShowClearLogsDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-black">Clear All Activity Logs?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-700">
              This will permanently delete all activity logs. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300 text-black hover:bg-gray-100">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleClearAllLogs}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Clear All Logs
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}