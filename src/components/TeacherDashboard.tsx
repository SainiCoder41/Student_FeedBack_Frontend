// src/components/TeacherDashboard.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { 
  User, 
  BookOpen, 
  Star, 
  LogOut, 
  TrendingUp, 
  MessageSquare,
  BarChart3,
  Target,
  Award,
  Calendar
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import axiosClient from "../utils/axiosClient";

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

interface UserData {
  _id: string;
  FullName: string;
  email: string;
  role: string;
  SubjectName?: string;
  SubjectCode?: string;
}

const TeacherDashboard = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosClient.post("/user/logout", {}, { withCredentials: true });
      navigate("/login");
    } catch (err) {
      toast({
        title: "Logout Failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user data
        const userResponse = await axiosClient.post("/user/me", {}, { withCredentials: true });
        setUser(userResponse.data.user);

        // Get feedbacks
        const feedbackResponse = await axiosClient.get("/user/getFeedback");
        if (feedbackResponse.data?.feedbacks) {
          setFeedbacks(feedbackResponse.data.feedbacks);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <BookOpen className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Loading Dashboard</h2>
          <p className="text-slate-600">Preparing your teaching insights...</p>
        </div>
      </div>
    );
  }

  // Calculate overall average rating and category averages
  const totalFeedbacks = feedbacks.length;
  
  const categoryAverages = {
    teaching_quality: totalFeedbacks > 0 ? 
      Number((feedbacks.reduce((acc, fb) => acc + fb.ratings.teaching_quality, 0) / totalFeedbacks).toFixed(2)) : 0,
    subject_clarity: totalFeedbacks > 0 ? 
      Number((feedbacks.reduce((acc, fb) => acc + fb.ratings.subject_clarity, 0) / totalFeedbacks).toFixed(2)) : 0,
    interaction: totalFeedbacks > 0 ? 
      Number((feedbacks.reduce((acc, fb) => acc + fb.ratings.interaction, 0) / totalFeedbacks).toFixed(2)) : 0,
    preparation: totalFeedbacks > 0 ? 
      Number((feedbacks.reduce((acc, fb) => acc + fb.ratings.preparation, 0) / totalFeedbacks).toFixed(2)) : 0,
    punctuality: totalFeedbacks > 0 ? 
      Number((feedbacks.reduce((acc, fb) => acc + fb.ratings.punctuality, 0) / totalFeedbacks).toFixed(2)) : 0,
  };

  const avgRating = totalFeedbacks > 0
    ? (
        Object.values(categoryAverages).reduce((acc, val) => acc + val, 0) / 5
      ).toFixed(2)
    : "0.00";

  // Rating distribution for pie chart
  const ratingDistribution = [
    { name: '5 Stars', value: feedbacks.filter(fb => {
      const avg = (fb.ratings.teaching_quality + fb.ratings.subject_clarity + fb.ratings.interaction + fb.ratings.preparation + fb.ratings.punctuality) / 5;
      return avg >= 4.5;
    }).length },
    { name: '4 Stars', value: feedbacks.filter(fb => {
      const avg = (fb.ratings.teaching_quality + fb.ratings.subject_clarity + fb.ratings.interaction + fb.ratings.preparation + fb.ratings.punctuality) / 5;
      return avg >= 4.0 && avg < 4.5;
    }).length },
    { name: '3 Stars', value: feedbacks.filter(fb => {
      const avg = (fb.ratings.teaching_quality + fb.ratings.subject_clarity + fb.ratings.interaction + fb.ratings.preparation + fb.ratings.punctuality) / 5;
      return avg >= 3.0 && avg < 4.0;
    }).length },
    { name: '2 Stars', value: feedbacks.filter(fb => {
      const avg = (fb.ratings.teaching_quality + fb.ratings.subject_clarity + fb.ratings.interaction + fb.ratings.preparation + fb.ratings.punctuality) / 5;
      return avg >= 2.0 && avg < 3.0;
    }).length },
    { name: '1 Star', value: feedbacks.filter(fb => {
      const avg = (fb.ratings.teaching_quality + fb.ratings.subject_clarity + fb.ratings.interaction + fb.ratings.preparation + fb.ratings.punctuality) / 5;
      return avg < 2.0;
    }).length },
  ];

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#6b7280'];

  // Group by month for charts
  const monthlyStats: Record<
    string,
    { month: string; ratingSum: number; count: number }
  > = {};

  feedbacks.forEach((fb) => {
    const date = new Date(fb.createdAt);
    const month = date.toLocaleString("default", { month: "short" });
    const feedbackAvg =
      (fb.ratings.teaching_quality +
        fb.ratings.subject_clarity +
        fb.ratings.interaction +
        fb.ratings.preparation +
        fb.ratings.punctuality) /
      5;

    if (!monthlyStats[month]) {
      monthlyStats[month] = { month, ratingSum: 0, count: 0 };
    }
    monthlyStats[month].ratingSum += feedbackAvg;
    monthlyStats[month].count += 1;
  });

  const performanceData = Object.values(monthlyStats).map((item) => ({
    month: item.month,
    rating: Number((item.ratingSum / item.count).toFixed(2)),
    responses: item.count,
  }));

  const categoryData = [
    { name: 'Teaching', score: categoryAverages.teaching_quality, fullMark: 5 },
    { name: 'Clarity', score: categoryAverages.subject_clarity, fullMark: 5 },
    { name: 'Interaction', score: categoryAverages.interaction, fullMark: 5 },
    { name: 'Preparation', score: categoryAverages.preparation, fullMark: 5 },
    { name: 'Punctuality', score: categoryAverages.punctuality, fullMark: 5 },
  ];

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const sizes = {
      sm: "w-3 h-3",
      md: "w-4 h-4",
      lg: "w-5 h-5"
    };
    
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${sizes[size]} ${i < Math.round(rating) ? "text-amber-500 fill-current" : "text-slate-300"}`}
      />
    ));
  };

  const getPerformanceLevel = (rating: number) => {
    if (rating >= 4.5) return "Exceptional";
    if (rating >= 4.0) return "Excellent";
    if (rating >= 3.0) return "Good";
    return "Needs Improvement";
  };

  const getPerformanceColor = (rating: number) => {
    if (rating >= 4.5) return "text-emerald-600";
    if (rating >= 4.0) return "text-blue-600";
    if (rating >= 3.0) return "text-amber-600";
    return "text-slate-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-slate-600 rounded-xl flex items-center justify-center shadow-md">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Teacher Portal</h1>
                <p className="text-slate-600 text-sm">Teaching performance dashboard</p>
              </div>
            </div>
            
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="border-slate-300 text-white-700 hover:bg-white-50 hover:border-white-400 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Profile Header */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-8">
            <div className="flex items-start space-x-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-slate-600 rounded-2xl flex items-center justify-center shadow-lg">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">{user?.FullName}</h2>
                    <p className="text-slate-600 text-lg mb-4">
                      {user?.SubjectName || 'Teacher'} • {user?.SubjectCode || 'General'}
                    </p>
                  </div>
                  <Badge className={`text-sm px-3 py-1 ${
                    Number(avgRating) >= 4.5 ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                    Number(avgRating) >= 4.0 ? 'bg-blue-100 text-blue-800 border-blue-200' :
                    'bg-amber-100 text-amber-800 border-amber-200'
                  }`}>
                    {getPerformanceLevel(Number(avgRating))}
                  </Badge>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {renderStars(Number(avgRating), "lg")}
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{avgRating}</span>
                    <span className="text-slate-500">/5</span>
                  </div>
                  <div className="flex items-center space-x-4 text-slate-600">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-5 h-5 text-blue-500" />
                      <span>{totalFeedbacks} Feedback{totalFeedbacks !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-emerald-500" />
                      <span>Joined {new Date().getFullYear()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-slate-600 text-sm">Average Rating</p>
                  <p className="text-2xl font-bold text-slate-900">{avgRating}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-slate-600 text-sm">Total Feedback</p>
                  <p className="text-2xl font-bold text-slate-900">{totalFeedbacks}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-slate-600 text-sm">Performance</p>
                  <p className="text-2xl font-bold text-slate-900">{getPerformanceLevel(Number(avgRating))}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-300 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-slate-600 text-sm">Best Category</p>
                  <p className="text-lg font-bold text-slate-900">
                    {Object.entries(categoryAverages).reduce((a, b) => a[1] > b[1] ? a : b)[0].replace('_', ' ')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="performance" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Rating Trend</span>
            </TabsTrigger>
            <TabsTrigger value="responses" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Responses</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Categories</span>
            </TabsTrigger>
            <TabsTrigger value="distribution" className="flex items-center space-x-2">
              <Award className="w-4 h-4" />
              <span>Distribution</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="performance">
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Monthly Rating Trend</CardTitle>
                <CardDescription>Average rating performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis domain={[0, 5]} stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="rating"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: "#3b82f6", r: 5 }}
                      activeDot={{ r: 7, fill: "#1d4ed8" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="responses">
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Monthly Feedback Count</CardTitle>
                <CardDescription>Number of feedback responses per month</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar
                      dataKey="responses"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

         <TabsContent value="categories">
  <Card className="bg-white border-slate-200 shadow-sm">
    <CardHeader>
      <CardTitle className="text-slate-900">Category Performance</CardTitle>
      <CardDescription>Average ratings across different teaching categories</CardDescription>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={categoryData}
          layout="vertical"
          // Add margin to provide space for the Y-axis labels
          margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis type="number" domain={[0, 5]} stroke="#64748b" />
          <YAxis
            type="category"
            dataKey="name"
            stroke="#64748b"
            // Set a fixed width for the Y-axis to ensure label space
            width={80}
            // Ensure all ticks are displayed
            interval={0}
            // Optional: Refine tick appearance
            tick={{
              fill: '#374151', // Change text color for better contrast
              fontSize: 14
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px'
            }}
          />
          <Bar
            dataKey="score"
            fill="#8b5cf6"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
</TabsContent>

          <TabsContent value="distribution">
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Rating Distribution</CardTitle>
                <CardDescription>Breakdown of feedback by rating levels</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={ratingDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {ratingDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default TeacherDashboard;