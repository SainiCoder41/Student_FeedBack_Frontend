// src/components/TeacherFeedback.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { User, BookOpen, Star, LogOut, ArrowLeft, Sparkles } from 'lucide-react';
import axiosClient from '@/utils/axiosClient';
import { useToast } from '@/hooks/use-toast';

interface TeacherType {
  _id: string;
  FullName: string;
  role: string;
  SubjectName?: string;
  SubjectCode?: string;
  hasSubmitted?: boolean;
}

interface TeacherFeedbackProps {
  teacher: TeacherType;
  onBack: () => void;
  updateTeacherStatus: (id: string) => void;
  onLogout: () => void;
}

const feedbackQuestions = [
  { id: 'teaching_quality', label: 'Teaching Quality', icon: '🎯' },
  { id: 'subject_clarity', label: 'Subject Clarity', icon: '📚' },
  { id: 'interaction', label: 'Student Interaction', icon: '💬' },
  { id: 'preparation', label: 'Class Preparation', icon: '📊' },
  { id: 'punctuality', label: 'Punctuality', icon: '⏰' },
];

const TeacherFeedback: React.FC<TeacherFeedbackProps> = ({ teacher, onBack, updateTeacherStatus, onLogout }) => {
  const { toast } = useToast();
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingChange = (questionId: string, rating: number) => {
    setRatings(prev => ({ ...prev, [questionId]: rating }));
  };

  const renderRatingInput = (questionId: string, currentRating = 0) => (
    <div className="flex space-x-2 mt-3">
      {Array.from({ length: 5 }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => handleRatingChange(questionId, i + 1)}
          className="focus:outline-none transform hover:scale-125 transition-all duration-200"
        >
          <Star
            className={`w-7 h-7 transition-all duration-300 ${
              i < currentRating 
                ? 'text-yellow-400 fill-current drop-shadow-lg' 
                : 'text-gray-600 hover:text-yellow-300'
            }`}
          />
        </button>
      ))}
    </div>
  );

  const handleSubmitFeedback = async () => {
    const allRated = feedbackQuestions.every(q => ratings[q.id]);
    if (!allRated) {
      toast({ title: 'Incomplete Feedback', description: 'Please rate all aspects before submitting.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);

    try {
      const feedbackData = {
        teacherId: teacher._id,
        ratings,
        comments: feedback,
      };

      await axiosClient.post('/user/feedback', feedbackData, { withCredentials: true });
      toast({
        title: 'Feedback Submitted!',
        description: `Thank you for your feedback about ${teacher.FullName}.`,
        className: 'bg-gradient-to-r from-purple-500 to-blue-500 text-white',
      });

      updateTeacherStatus(teacher._id); // Mark teacher as submitted
      onBack(); // Go back to dashboard
    } catch (error: any) {
      console.error(error);
      toast({
        title: 'Submission Failed',
        description: error.response?.data?.message || 'Failed to submit feedback. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-lg shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={onBack} className="mr-4 text-gray-300 hover:text-white hover:bg-gray-800 transition-all">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Submit Feedback
                </h1>
              </div>
            </div>
            <Button onClick={onLogout} variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white transition-all">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-lg shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:space-x-6 p-6">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4 md:mb-0 shadow-lg">
              <User className="w-12 h-12 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-2xl font-bold text-white mb-2">{teacher.FullName}</CardTitle>
              <CardDescription className="text-gray-400 mb-3">{teacher.role}</CardDescription>
              <div className="space-y-1">
                <p className="text-gray-300 flex items-center">
                  <BookOpen className="w-4 h-4 mr-2 text-purple-400" />
                  Subject: {teacher.SubjectName}
                </p>
                <p className="text-gray-300">Code: {teacher.SubjectCode}</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-lg shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-white flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
              Rate Your Experience
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6 pt-0">
            {feedbackQuestions.map(q => (
              <div key={q.id} className="p-4 bg-gray-700/30 rounded-xl border border-gray-600/50">
                <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center">
                  <span className="mr-2">{q.icon}</span>
                  {q.label}
                </label>
                {renderRatingInput(q.id, ratings[q.id])}
              </div>
            ))}
            <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-600/50">
              <label className="block text-sm font-medium text-gray-200 mb-2">💭 Additional Comments (Optional)</label>
              <Textarea
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                placeholder="Share your thoughts..."
                className="min-h-[120px] w-full bg-gray-800 border-gray-600 text-white placeholder-gray-500 focus:border-purple-500 transition-all"
              />
            </div>
            <Button
              onClick={handleSubmitFeedback}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Submitting...
                </div>
              ) : 'Submit Feedback ✨'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherFeedback;
