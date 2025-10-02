// src/components/Performance.tsx
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axiosClient from "../utils/axiosClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Users, TrendingUp, Award, BookOpen, ArrowLeft, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Teacher {
  _id: string;
  FullName: string;
  SubjectName: string;
  SubjectCode: string;
  role: string;
}

interface Feedback {
  _id: string;
  studentId: { _id: string; FullName: string };
  teacherId: string;
  ratings: {
    teaching_quality: number;
    subject_clarity: number;
    interaction: number;
    preparation: number;
    punctuality: number;
  };
  comments?: string;
  createdAt: string;
}

const Performance = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [user, setUser] = useState<{ FullName: string; role: string } | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user
        const userRes = await axiosClient.post("/user/me", {}, { withCredentials: true });
        setUser(userRes.data.user);

        const teachersRes = await axiosClient.get("/user/getAll");
        const feedbackRes = await axiosClient.get("/user/getAllFeedback");

        const fetchedTeachers = (teachersRes.data?.teachers || teachersRes.data || []).filter(
          (t: Teacher) => t.role === "Teacher"
        );

        setTeachers(fetchedTeachers);
        setFeedbacks(feedbackRes.data?.feedbacks || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast({
          title: "Error",
          description: "Failed to load performance data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleLogout = async () => {
    try {
      await axiosClient.post("/user/logout", {}, { withCredentials: true });
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of the system",
      });
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
      toast({
        title: "Logout failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    // Navigate based on user role
    if (user?.role === "Admin") {
      navigate("/admin-dashboard");
    } else if (user?.role === "Teacher") {
      navigate("/teacher-dashboard");
    } else {
      navigate("/student-dashboard");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <BookOpen className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Loading Performance Data</h2>
          <p className="text-slate-600">Please wait while we load teacher performance information...</p>
        </div>
      </div>
    );
  }

  const renderStars = (avg: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 transition-all duration-300 ${
          i < Math.round(avg) 
            ? "text-amber-500 fill-current" 
            : "text-slate-300"
        }`}
      />
    ));

  const getTeacherFeedbackStats = (teacherId: string) => {
    const teacherFeedbacks = feedbacks.filter(fb => fb.teacherId === teacherId);
    const total = teacherFeedbacks.length;

    const avg =
      total > 0
        ? teacherFeedbacks.reduce((acc, fb) => {
            const sumRatings =
              fb.ratings.teaching_quality +
              fb.ratings.subject_clarity +
              fb.ratings.interaction +
              fb.ratings.preparation +
              fb.ratings.punctuality;
            return acc + sumRatings / 5;
          }, 0) / total
        : 0;

    return { total, avg: Number(avg.toFixed(2)) };
  };

  const getPerformanceColor = (avg: number) => {
    if (avg >= 4.5) return "from-emerald-500 to-teal-600";
    if (avg >= 4.0) return "from-blue-500 to-cyan-600";
    if (avg >= 3.0) return "from-amber-500 to-orange-500";
    return "from-slate-400 to-slate-500";
  };

  const getPerformanceLevel = (avg: number) => {
    if (avg >= 4.5) return "Exceptional";
    if (avg >= 4.0) return "Excellent";
    if (avg >= 3.0) return "Good";
    return "Needs Improvement";
  };

  const getPerformanceBadgeColor = (avg: number) => {
    if (avg >= 4.5) return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (avg >= 4.0) return "bg-blue-100 text-blue-800 border-blue-200";
    if (avg >= 3.0) return "bg-amber-100 text-amber-800 border-amber-200";
    return "bg-slate-100 text-slate-800 border-slate-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header with Navigation */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleBack}
                variant="outline"
                className="border-slate-300 text-white-700 hover:bg-black-50 hover:border-slate-400 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-slate-600 rounded-xl flex items-center justify-center shadow-md">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Teacher Performance</h1>
                <p className="text-slate-600 text-sm">
                  Welcome, {user?.FullName} • {user?.role}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-6 text-sm text-slate-600">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>{teachers.length} Teachers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span>{feedbacks.length} Feedbacks</span>
                </div>
              </div>
              
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="border-slate-300 text-white-700 hover:bg-black-50 hover:border-black-400 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Subtle Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-slate-300/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12 pt-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-3">
              Performance Overview
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Comprehensive analysis of teaching performance based on student feedback and ratings
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-slate-600 text-sm">Total Teachers</p>
                  <p className="text-2xl font-bold text-slate-900">{teachers.length}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-emerald-50 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-slate-600 text-sm">Total Feedbacks</p>
                  <p className="text-2xl font-bold text-slate-900">{feedbacks.length}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-amber-50 rounded-xl">
                  <Award className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-slate-600 text-sm">Average Rating</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {teachers.length > 0
                      ? (
                          teachers.reduce((acc, teacher) => {
                            const stats = getTeacherFeedbackStats(teacher._id);
                            return acc + stats.avg;
                          }, 0) / teachers.length
                        ).toFixed(1)
                      : "0.0"}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Teacher Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teachers.map(teacher => {
              const stats = getTeacherFeedbackStats(teacher._id);
              const performanceColor = getPerformanceColor(stats.avg);
              const performanceLevel = getPerformanceLevel(stats.avg);
              const badgeColor = getPerformanceBadgeColor(stats.avg);

              return (
                <div
                  key={teacher._id}
                  className="group cursor-pointer"
                  onMouseEnter={() => setHoveredCard(teacher._id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Card className="relative bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-slate-300">
                    {/* Performance Indicator Bar */}
                    <div 
                      className={`h-1 bg-gradient-to-r ${performanceColor} transition-all duration-500`}
                    ></div>

                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg font-semibold text-slate-900 truncate">
                            {teacher.FullName}
                          </CardTitle>
                          <CardDescription className="text-slate-600 text-sm mt-1">
                            {teacher.SubjectName}
                          </CardDescription>
                        </div>
                        <Badge 
                          className={`${badgeColor} border font-medium px-2 py-1 text-xs`}
                        >
                          {performanceLevel}
                        </Badge>
                      </div>

                      {/* Rating Display */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            {renderStars(stats.avg)}
                          </div>
                          <span className="text-slate-900 font-semibold text-lg">{stats.avg}</span>
                          <span className="text-slate-400 text-sm">/5</span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <div className="text-xl font-bold text-slate-900">{stats.total}</div>
                          <div className="text-slate-600 text-xs">Feedbacks</div>
                        </div>
                        <div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <div className="text-xl font-bold text-slate-900">
                            {feedbacks.length > 0 ? Math.round((stats.total / feedbacks.length) * 100) : 0}%
                          </div>
                          <div className="text-slate-600 text-xs">Participation</div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-slate-600 mb-1">
                          <span>Performance</span>
                          <span>{Math.round((stats.avg / 5) * 100)}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full bg-gradient-to-r ${performanceColor} transition-all duration-1000 ease-out`}
                            style={{ width: `${(stats.avg / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <NavLink
                        to={`/showPerformance/${teacher._id}`}
                        className="block w-full text-center py-2.5 px-4 bg-slate-900 text-white rounded-xl font-medium transition-all duration-300 hover:bg-slate-800 active:scale-95 border border-slate-900"
                      >
                        View Details
                      </NavLink>
                    </CardContent>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-blue-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </Card>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {teachers.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-3xl flex items-center justify-center border border-slate-200">
                <Users className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No Teachers Found</h3>
              <p className="text-slate-600">There are currently no teachers to display.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Performance;