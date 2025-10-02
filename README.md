import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  User,
  BookOpen,
  Star,
  LogOut,
  CheckCircle,
  Search,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Users,
  BarChart3,
  Filter,
  Zap,
  Target
} from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

export default function StudentDashboard() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const resUser = await axiosClient.post(
          '/user/me',
          {},
          { withCredentials: true }
        );
        setUser(resUser.data.user || { FullName: 'Unknown', role: 'Unknown' });

        const res = await axiosClient.get('/user/getAll', {
          withCredentials: true
        });
        let teacherData = res.data
          .filter((u: any) => u.role === 'Teacher')
          .map((t: any) => ({
            ...t,
            hasSubmitted: false,
            rating: Math.random() * 2 + 3,
            students: Math.floor(Math.random() * 100) + 20
          }));

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
      console.error(err);
      toast({ title: 'Error', description: 'Logout failed' });
    }
  };

  const handleGiveFeedback = (teacher: any) => {
    navigate('/feedback', { state: { teacher } });
  };

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.FullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.SubjectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.SubjectCode?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="relative mb-6">
            <div className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <Sparkles className="w-8 h-8 text-purple-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
            Loading Dashboard
          </h2>
          <p className="text-gray-400">Preparing your academic journey...</p>
        </div>
      </div>
    );
  }

  const submittedCount = teachers.filter(t => t.hasSubmitted).length;
  const totalTeachers = teachers.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-10 animate-pulse delay-500"></div>
        
        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header 
        ref={headerRef}
        className="relative border-b border-gray-800 bg-gray-900/60 backdrop-blur-xl shadow-2xl z-10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl transform hover:rotate-12 transition-transform duration-300">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-30"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
                  Student Portal
                </h1>
                <p className="text-sm text-gray-300 flex items-center">
                  <Sparkles className="w-4 h-4 mr-1 text-yellow-400" />
                  Welcome back, {user?.FullName}
                </p>
              </div>
            </div>
            
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-300 transform hover:scale-105 backdrop-blur-sm group"
            >
              <LogOut className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-6 py-8 space-y-8 z-10">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
            <Card className="relative bg-gray-800/40 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 shadow-2xl">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Teachers</p>
                  <p className="text-3xl font-bold text-white">{totalTeachers}</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
            <Card className="relative bg-gray-800/40 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 shadow-2xl">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Feedback Submitted</p>
                  <p className="text-3xl font-bold text-white">{submittedCount}</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
            <Card className="relative bg-gray-800/40 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 shadow-2xl">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Completion Rate</p>
                  <p className="text-3xl font-bold text-white">
                    {totalTeachers ? Math.round((submittedCount / totalTeachers) * 100) : 0}%
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Search Section */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5 z-10" />
            <Input
              placeholder="Search teachers, subjects, or codes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 w-full bg-gray-800/80 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 transition-all h-14 rounded-2xl backdrop-blur-sm text-lg shadow-xl"
            />
          </div>
        </div>

        {/* Teachers Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Your Teachers
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Filter className="w-4 h-4" />
              <span>{filteredTeachers.length} teachers found</span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTeachers.map((teacher) => (
              <div
                key={teacher._id}
                className={`relative group cursor-pointer transform transition-all duration-500 ${
                  hoveredCard === teacher._id ? 'scale-105' : 'scale-100'
                } ${teacher.hasSubmitted ? 'opacity-80' : 'opacity-100'}`}
                onMouseEnter={() => setHoveredCard(teacher._id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* 3D Glow Effect */}
                <div className={`absolute -inset-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300 ${
                  hoveredCard === teacher._id ? 'opacity-40' : 'opacity-25'
                }`}></div>
                
                <Card className="relative bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 shadow-2xl transition-all duration-300 h-full overflow-hidden">
                  {/* Animated Background Strip */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>
                  
                  <CardHeader className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:rotate-6 transition-transform duration-300">
                            <User className="w-8 h-8 text-white" />
                          </div>
                          {teacher.hasSubmitted && (
                            <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1 shadow-lg">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Rating Badge */}
                      <div className="flex items-center space-x-1 bg-gray-900/80 px-3 py-1 rounded-full border border-gray-700">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-white text-sm font-semibold">
                          {teacher.rating?.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    <CardTitle className="text-xl font-bold text-white mb-2 line-clamp-1">
                      {teacher.FullName}
                    </CardTitle>
                    
                    <CardDescription className="text-gray-300 mb-1">
                      {teacher.role}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-6 pt-0">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 text-gray-300">
                        <BookOpen className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-medium">{teacher.SubjectName || 'General Studies'}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-gray-400">
                          <span>#{teacher.SubjectCode || 'N/A'}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-400">
                          <Users className="w-4 h-4" />
                          <span>{teacher.students} students</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="pt-2">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Feedback Status</span>
                          <span>{teacher.hasSubmitted ? 'Completed' : 'Pending'}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              teacher.hasSubmitted 
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 w-full' 
                                : 'bg-gradient-to-r from-purple-500 to-blue-500 w-1/3 animate-pulse'
                            }`}
                          ></div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button 
                        onClick={() => !teacher.hasSubmitted && handleGiveFeedback(teacher)}
                        className={`w-full mt-2 transition-all duration-300 transform group ${
                          teacher.hasSubmitted 
                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
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
                            <Zap className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
                            Provide Feedback
                            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {filteredTeachers.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-800/60 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-gray-700">
                <Search className="w-10 h-10 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No teachers found</h3>
              <p className="text-gray-400">Try adjusting your search criteria</p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-gray-800 bg-gray-900/60 backdrop-blur-xl mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Student Feedback Portal. Elevating education through meaningful feedback.
          </p>
        </div>
      </footer>
    </div>
  );
}