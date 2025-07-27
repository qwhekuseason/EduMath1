// app/dashboard/assignments/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { ClipboardCheck, Clock, CheckCircle, AlertTriangle, Calendar, Filter, Tag, Send as PaperPlane, Sparkles, Brain, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import LoadingSpinner from '@/app/dashboard/LoadingSpinner/page';

// --- (NEW) Import the useAuth hook to get user data ---
import { useAuth } from '@/hooks/useAuth';

// --- (NEW) Helper to map our mock data to a grade level ---
const subjectToLevel = (subject: string): 'primary' | 'jhs' | 'shs' => {
  const s = subject.toLowerCase();
  if (s === 'algebra' || s === 'geometry') return 'shs';
  if (s === 'number theory') return 'jhs';
  return 'primary'; // Default for other subjects
};


export default function AssignmentsPage() {
  const { userData, loading } = useAuth(); // <-- Get user data and loading state
  const [filterStatus, setFilterStatus] = useState('all');

  // This is your original, complete list of mock assignments
  const allAssignments = [
    { id: 1, title: 'Linear Equations Practice', subject: 'Algebra', description: 'Solve 10 linear equations...', dueDate: '15 Nov 2024', status: 'pending', progress: 0, totalQuestions: 10, completedQuestions: 0 },
    { id: 2, title: 'Geometry Angles Quiz', subject: 'Geometry', description: 'Calculate missing angles...', dueDate: '10 Nov 2024', submittedDate: '10 Nov 2024', status: 'submitted', progress: 100, totalQuestions: 8, completedQuestions: 8 },
    { id: 3, title: 'Fractions Test', subject: 'Number Theory', description: 'Operations with fractions...', dueDate: '05 Nov 2024', submittedDate: '05 Nov 2024', gradedDate: '05 Nov 2024', status: 'graded', progress: 100, score: 85, totalQuestions: 12, completedQuestions: 12 },
    { id: 4, title: 'Word Problems Set', subject: 'Algebra', description: 'Solve 5 word problems...', dueDate: '01 Nov 2024', status: 'overdue', progress: 0, totalQuestions: 5, completedQuestions: 0 }
  ];

  // --- (NEW) State to hold the assignments relevant to the user's grade ---
  const [userAssignments, setUserAssignments] = useState(allAssignments);

  useEffect(() => {
    if (userData) {
      const userLevel = userData.grade.toLowerCase().includes('shs') ? 'shs' :
                        userData.grade.toLowerCase().includes('jhs') ? 'jhs' : 'primary';
      
      const filtered = allAssignments.filter(a => subjectToLevel(a.subject) === userLevel);
      setUserAssignments(filtered);
    }
  }, [userData]); // This effect runs whenever userData changes

  // --- (MODIFIED) Now, all logic uses the dynamic 'userAssignments' list ---
  const statusCounts = {
    pending: userAssignments.filter(a => a.status === 'pending').length,
    submitted: userAssignments.filter(a => a.status === 'submitted').length,
    graded: userAssignments.filter(a => a.status === 'graded').length,
    overdue: userAssignments.filter(a => a.status === 'overdue').length
  };

  const filteredAssignments = filterStatus === 'all' 
    ? userAssignments 
    : userAssignments.filter(assignment => assignment.status === filterStatus);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'submitted': return <PaperPlane className="w-4 h-4" />;
      case 'graded': return <CheckCircle className="w-4 h-4" />;
      case 'overdue': return <AlertTriangle className="w-4 h-4" />;
      default: return <ClipboardCheck className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'submitted': return 'bg-blue-500';
      case 'graded': return 'bg-green-500';
      case 'overdue': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getBorderColor = (status: string) => {
    switch (status) {
      case 'pending': return 'border-l-yellow-500';
      case 'submitted': return 'border-l-blue-500';
      case 'graded': return 'border-l-green-500';
      case 'overdue': return 'border-l-red-500';
      default: return 'border-l-gray-500';
    }
  };

  // --- (NEW) Show a loading spinner while fetching data ---
  if (loading || !userData) {
    return <LoadingSpinner />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gradient mb-2">My Assignments</h1>
            <p className="text-xl text-gray-600">Assignments for {userData.grade} 📚</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 bg-white rounded-xl p-2 shadow-modern border">
              <Filter className="w-4 h-4 text-gray-500" />
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-sm font-medium"
              >
                <option value="all">All Assignments</option>
                <option value="pending">Pending</option>
                <option value="submitted">Submitted</option>
                <option value="graded">Graded</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
        </div>

        {/* Summary Cards with Modern Design */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="card-hover border-0 shadow-modern bg-gradient-to-br from-yellow-50 to-orange-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/10 rounded-full -mr-8 -mt-8"></div>
            <CardContent className="p-6 text-center relative">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-yellow-600 mb-1">{statusCounts.pending}</div>
              <div className="text-sm font-medium text-gray-700">Pending</div>
            </CardContent>
          </Card>

          <Card className="card-hover border-0 shadow-modern bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-full -mr-8 -mt-8"></div>
            <CardContent className="p-6 text-center relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <PaperPlane className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-1">{statusCounts.submitted}</div>
              <div className="text-sm font-medium text-gray-700">Submitted</div>
            </CardContent>
          </Card>

          <Card className="card-hover border-0 shadow-modern bg-gradient-to-br from-green-50 to-emerald-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/10 rounded-full -mr-8 -mt-8"></div>
            <CardContent className="p-6 text-center relative">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-green-600 mb-1">{statusCounts.graded}</div>
              <div className="text-sm font-medium text-gray-700">Graded</div>
            </CardContent>
          </Card>

          <Card className="card-hover border-0 shadow-modern bg-gradient-to-br from-red-50 to-pink-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-full -mr-8 -mt-8"></div>
            <CardContent className="p-6 text-center relative">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-red-600 mb-1">{statusCounts.overdue}</div>
              <div className="text-sm font-medium text-gray-700">Overdue</div>
            </CardContent>
          </Card>
        </div>

        {/* Assignments List with Modern Design */}
        <Card className="border-0 shadow-modern">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-8 flex items-center">
              <Target className="w-6 h-6 mr-3 text-blue-500" />
              Current Assignments
            </h3>
            <div className="space-y-4">
              {filteredAssignments.map((assignment) => (
                <div key={assignment.id} className={`border-l-4 ${getBorderColor(assignment.status)} bg-white p-6 rounded-r-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 ${getStatusColor(assignment.status)} rounded-xl text-white shadow-lg`}>
                        {getStatusIcon(assignment.status)}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900 mb-2">{assignment.title}</h4>
                        <p className="text-gray-600 mb-3">{assignment.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Due: {assignment.dueDate}
                          </span>
                          <Badge variant="secondary" className="capitalize">
                            {assignment.subject}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={`${getStatusColor(assignment.status)} text-white mb-2`}>
                        {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                      </Badge>
                      {assignment.score && (
                        <div className="text-lg font-bold text-green-600">
                          {assignment.score}%
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {assignment.progress > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progress</span>
                        <span>{assignment.completedQuestions}/{assignment.totalQuestions} questions</span>
                      </div>
                      <Progress value={assignment.progress} className="h-2 progress-modern" />
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      {assignment.submittedDate && `Submitted: ${assignment.submittedDate}`}
                      {assignment.gradedDate && ` • Graded: ${assignment.gradedDate}`}
                    </div>
                    <div className="flex space-x-2">
                      {assignment.status === 'pending' && (
                        <Button size="sm" className="btn-modern gradient-primary text-white rounded-xl">
                          <Brain className="w-4 h-4 mr-2" />
                          Start Assignment
                        </Button>
                      )}
                      {assignment.status === 'graded' && (
                        <Button variant="outline" size="sm" className="rounded-xl">
                          View Feedback
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredAssignments.length === 0 && (
              <div className="text-center py-16">
                <ClipboardCheck className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">No assignments found</h3>
                <p className="text-gray-600 mb-6">
                  {filterStatus === 'all' 
                    ? "You don't have any assignments yet. Check back later!" 
                    : `No ${filterStatus} assignments at the moment.`}
                </p>
                <Button asChild className="btn-modern gradient-success text-white rounded-xl">
                  <a href="/dashboard/lessons">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Continue Learning
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}