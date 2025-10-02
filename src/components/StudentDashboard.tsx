import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  User, 
  BookOpen, 
  Star, 
  CheckCircle, 
  LogOut, 
  Search, 
  ArrowRight, 
  GraduationCap, 
  Users, 
  Target,
  Zap,
  Filter,
  BarChart3,
  Clock,
  BookCheck
} from 'lucide-react';
import axiosClient from '@/utils/axiosClient';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import TeacherFeedback from './TeacherFeedback';

interface UserType {
  _id: string;
  FullName: string;
  role: string;
  SubjectName?: string;
  SubjectCode?: string;
  hasSubmitted?: boolean;
  rating?: number;
  students?: number;
}

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [teachers, setTeachers] = useState<UserType[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<UserType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState<{ FullName: string; role: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Get current user
        const resUser = await axiosClient.post('/user/me', {}, { withCredentials: true });
        setUser(resUser.data.user || { FullName: 'Unknown', role: 'Unknown' });

        // Get all teachers
        const res = await axiosClient.get('/user/getAll', { withCredentials: true });
        let teacherData = res.data.filter((u: any) => u.role === 'Teacher')
          .map((t: any) => ({ 
            ...t, 
            hasSubmitted: false,
            rating: Math.random() * 2 + 3,
            students: Math.floor(Math.random() * 100) + 20
          }));

        // Get submitted feedbacks if endpoint exists
        try {
          const resFeedback = await axiosClient.get('/user/Submitedfeedback', {
            withCredentials: true
          });
          const submittedFeedbacks = resFeedback.data.feedbacks;

          teacherData = teacherData.map((teacher: any) => {
            const found = submittedFeedbacks.some(
              (fb: any) => fb.teacherId._id === teacher._id
            );
            return { ...teacher, hasSubmitted: found };
          });
        } catch (feedbackError) {
          console.log('Feedback endpoint not available, using default hasSubmitted: false');
        }

        setTeachers(teacherData);
      } catch (err) {
        console.error(err);
        toast({ 
          title: 'Error', 
          description: 'Failed to load data', 
          variant: 'destructive' 
        });
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [navigate, toast]);

  const handleLogout = async () => {
    try {
      await axiosClient.post('/user/logout', {}, { withCredentials: true });
      navigate('/login');
    } catch (err) {
      toast({ 
        title: 'Logout Failed', 
        description: 'Please try again', 
        variant: 'destructive' 
      });
    }
  };

  const updateTeacherStatus = (id: string) => {
    setTeachers(prev => prev.map(t => t._id === id ? { ...t, hasSubmitted: true } : t));
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <GraduationCap className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Loading Dashboard</h2>
          <p className="text-slate-600">Preparing your academic dashboard...</p>
        </div>
      </div>
    );
  }

  // Render TeacherFeedback component when teacher is selected
  if (selectedTeacher) {
    return (
      <TeacherFeedback
        teacher={selectedTeacher}
        onBack={() => setSelectedTeacher(null)}
        updateTeacherStatus={updateTeacherStatus}
        onLogout={handleLogout}
      />
    );
  }

  const filteredTeachers = teachers.filter(teacher => 
    teacher.FullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (teacher.SubjectName && teacher.SubjectName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (teacher.SubjectCode && teacher.SubjectCode.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const submittedCount = teachers.filter(t => t.hasSubmitted).length;
  const totalTeachers = teachers.length;
  const completionRate = totalTeachers ? Math.round((submittedCount / totalTeachers) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-slate-600 rounded-xl flex items-center justify-center shadow-md">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Student Portal</h1>
                <p className="text-slate-600 text-sm">Welcome back, {user?.FullName}</p>
              </div>
            </div>
            
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="border-slate-300 white hover:bg-black-50 hover:border-slate-400 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-slate-600 text-sm">Total Teachers</p>
                  <p className="text-2xl font-bold text-slate-900">{totalTeachers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <BookCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-slate-600 text-sm">Feedback Submitted</p>
                  <p className="text-2xl font-bold text-slate-900">{submittedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-slate-600 text-sm">Completion Rate</p>
                  <p className="text-2xl font-bold text-slate-900">{completionRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-900">Feedback Progress</h3>
              <span className="text-sm text-slate-600">{submittedCount} of {totalTeachers} completed</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div 
                className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        {/* Search Section */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <Input
            placeholder="Search teachers, subjects, or codes..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-12 w-full bg-white border-slate-300 focus:border-blue-500 transition-colors h-12 rounded-xl text-lg"
          />
        </div>

        {/* Teachers Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Your Teachers</h2>
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <Filter className="w-4 h-4" />
              <span>{filteredTeachers.length} teachers</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeachers.length > 0 ? filteredTeachers.map(teacher => (
              <Card 
                key={teacher._id}
                className={`bg-white border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                  teacher.hasSubmitted ? 'opacity-75' : ''
                }`}
                onMouseEnter={() => setHoveredCard(teacher._id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => !teacher.hasSubmitted && setSelectedTeacher(teacher)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-slate-600 rounded-xl flex items-center justify-center">
                          <User className="w-7 h-7 text-white" />
                        </div>
                        {teacher.hasSubmitted && (
                          <div className="absolute -top-2 -right-2 bg-emerald-500 rounded-full p-1 shadow-lg">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 bg-slate-100 px-2 py-1 rounded-full">
                      <Star className="w-4 h-4 text-amber-500 fill-current" />
                      <span className="text-slate-900 text-sm font-semibold">
                        {teacher.rating?.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <CardTitle className="text-lg font-bold text-slate-900 mb-2">
                    {teacher.FullName}
                  </CardTitle>
                  
                  <CardDescription className="text-slate-600">
                    {teacher.role}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-slate-700">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium">{teacher.SubjectName || 'General Studies'}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>#{teacher.SubjectCode || 'N/A'}</span>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{teacher.students} students</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="flex justify-between text-xs text-slate-600 mb-1">
                        <span>Status</span>
                        <span className={teacher.hasSubmitted ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}>
                          {teacher.hasSubmitted ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            teacher.hasSubmitted 
                              ? 'bg-emerald-500 w-full' 
                              : 'bg-blue-500 w-1/3'
                          }`}
                        ></div>
                      </div>
                    </div>

                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!teacher.hasSubmitted) {
                          setSelectedTeacher(teacher);
                        }
                      }}
                      className={`w-full mt-2 ${
                        teacher.hasSubmitted 
                          ? 'bg-slate-100 text-slate-500 cursor-not-allowed hover:bg-slate-100' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
                      }`}
                      disabled={teacher.hasSubmitted}
                    >
                      {teacher.hasSubmitted ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Feedback Submitted
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Provide Feedback
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="col-span-full text-center py-16">
                <div className="w-24 h-24 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No teachers found</h3>
                <p className="text-slate-600">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-white/80 backdrop-blur-md border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center">
          <p className="text-slate-600 text-sm">
            © {new Date().getFullYear()} Student Feedback Portal. Elevating education through meaningful feedback.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default StudentDashboard;