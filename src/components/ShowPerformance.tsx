// src/components/ShowPerformance.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosClient from "../utils/axiosClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  ArrowLeft, 
  User, 
  Calendar, 
  MessageSquare, 
  BarChart3, 
  Target,
  TrendingUp,
  Award
} from "lucide-react";
import {
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

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

interface Teacher {
  _id: string;
  FullName: string;
  SubjectName: string;
  SubjectCode: string;
}

interface RatingStats {
  teaching_quality: number;
  subject_clarity: number;
  interaction: number;
  preparation: number;
  punctuality: number;
}

const ShowPerformance = () => {
  const { T } = useParams<{ T: string }>();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [overallAvg, setOverallAvg] = useState<number>(0);
  const [ratingStats, setRatingStats] = useState<RatingStats>({
    teaching_quality: 0,
    subject_clarity: 0,
    interaction: 0,
    preparation: 0,
    punctuality: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
      if (!T) return;
      try {
        const res = await axiosClient.get(`/user/getTeacherPerformance/${T}`);
        setTeacher(res.data.teacher);
        setFeedbacks(res.data.feedbacks);
        setOverallAvg(Number(res.data.overallAvg));
        
        // Calculate individual rating averages
        if (res.data.feedbacks?.length > 0) {
          const stats = {
            teaching_quality: 0,
            subject_clarity: 0,
            interaction: 0,
            preparation: 0,
            punctuality: 0
          };
          
          res.data.feedbacks.forEach((fb: Feedback) => {
            stats.teaching_quality += fb.ratings.teaching_quality;
            stats.subject_clarity += fb.ratings.subject_clarity;
            stats.interaction += fb.ratings.interaction;
            stats.preparation += fb.ratings.preparation;
            stats.punctuality += fb.ratings.punctuality;
          });
          
          const count = res.data.feedbacks.length;
          setRatingStats({
            teaching_quality: Number((stats.teaching_quality / count).toFixed(2)),
            subject_clarity: Number((stats.subject_clarity / count).toFixed(2)),
            interaction: Number((stats.interaction / count).toFixed(2)),
            preparation: Number((stats.preparation / count).toFixed(2)),
            punctuality: Number((stats.punctuality / count).toFixed(2))
          });
        }
      } catch (err) {
        console.error("Error fetching performance:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformance();
  }, [T]);

  // Chart data preparation
  const radarData = [
    { subject: 'Teaching', A: ratingStats.teaching_quality, fullMark: 5 },
    { subject: 'Clarity', A: ratingStats.subject_clarity, fullMark: 5 },
    { subject: 'Interaction', A: ratingStats.interaction, fullMark: 5 },
    { subject: 'Preparation', A: ratingStats.preparation, fullMark: 5 },
    { subject: 'Punctuality', A: ratingStats.punctuality, fullMark: 5 },
  ];

  const barData = [
    { name: 'Teaching', score: ratingStats.teaching_quality },
    { name: 'Clarity', score: ratingStats.subject_clarity },
    { name: 'Interaction', score: ratingStats.interaction },
    { name: 'Preparation', score: ratingStats.preparation },
    { name: 'Punctuality', score: ratingStats.punctuality },
  ];

  const ratingDistributionData = [
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

  const monthlyTrendData = feedbacks.reduce((acc: any[], feedback) => {
    const month = new Date(feedback.createdAt).toLocaleDateString('en-US', { month: 'short' });
    const existingMonth = acc.find(item => item.month === month);
    const feedbackAvg = (
      feedback.ratings.teaching_quality +
      feedback.ratings.subject_clarity +
      feedback.ratings.interaction +
      feedback.ratings.preparation +
      feedback.ratings.punctuality
    ) / 5;

    if (existingMonth) {
      existingMonth.rating = (existingMonth.rating + feedbackAvg) / 2;
      existingMonth.count += 1;
    } else {
      acc.push({ month, rating: feedbackAvg, count: 1 });
    }
    return acc;
  }, []).slice(-6); // Last 6 months

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

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-emerald-600";
    if (rating >= 4.0) return "text-blue-600";
    if (rating >= 3.0) return "text-amber-600";
    return "text-slate-600";
  };

  const getProgressColor = (rating: number) => {
    if (rating >= 4.5) return "bg-emerald-500";
    if (rating >= 4.0) return "bg-blue-500";
    if (rating >= 3.0) return "bg-amber-500";
    return "bg-slate-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-slate-300 border-b-transparent rounded-full animate-spin animation-delay-500"></div>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-3xl flex items-center justify-center border border-slate-200">
            <User className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Teacher Not Found</h3>
          <p className="text-slate-600 mb-6">The requested teacher could not be found.</p>
          <Link to="/performance" className="inline-flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Performance
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/performance" 
            className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Performance
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{teacher.FullName}</h1>
              <p className="text-slate-600 text-lg">{teacher.SubjectName} • {teacher.SubjectCode}</p>
            </div>
            
            {/* Overall Rating */}
            <div className="mt-4 lg:mt-0 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="text-center">
                <div className="flex justify-center space-x-1 mb-3">
                  {renderStars(overallAvg, "lg")}
                </div>
                <div className="text-3xl font-bold text-slate-900">{overallAvg}</div>
                <div className="text-slate-600 text-sm">Overall Rating</div>
                <Badge className="mt-2 bg-slate-100 text-slate-800 border-slate-200">
                  {feedbacks.length} Feedback{feedbacks.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Radar Chart - Skill Assessment */}
          <Card className="bg-white rounded-2xl shadow-sm border border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-900">
                <Target className="w-5 h-5 mr-2" />
                Skill Radar
              </CardTitle>
              <CardDescription>Comprehensive skill assessment across all categories</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 5]} />
                  <Radar
                    name="Performance"
                    dataKey="A"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Bar Chart - Rating Comparison */}
          <Card className="bg-white rounded-2xl shadow-sm border border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-900">
                <BarChart3 className="w-5 h-5 mr-2" />
                Rating Comparison
              </CardTitle>
              <CardDescription>Detailed scores across different categories</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Rating Distribution Pie Chart */}
          <Card className="bg-white rounded-2xl shadow-sm border border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-900">
                <Award className="w-5 h-5 mr-2" />
                Rating Distribution
              </CardTitle>
              <CardDescription>Breakdown of feedback by rating levels</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ratingDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {ratingDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Trend Line Chart */}
          <Card className="bg-white rounded-2xl shadow-sm border border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-900">
                <TrendingUp className="w-5 h-5 mr-2" />
                Monthly Trend
              </CardTitle>
              <CardDescription>Performance trend over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="rating"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Individual Feedbacks */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Student Feedbacks
          </h2>

          {feedbacks.length === 0 ? (
            <Card className="bg-white rounded-2xl shadow-sm border border-slate-200">
              <CardContent className="py-12 text-center">
                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Feedbacks Yet</h3>
                <p className="text-slate-600">This teacher hasn't received any feedback yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {feedbacks.map((fb) => {
                const individualAvg = (
                  fb.ratings.teaching_quality +
                  fb.ratings.subject_clarity +
                  fb.ratings.interaction +
                  fb.ratings.preparation +
                  fb.ratings.punctuality
                ) / 5;

                return (
                  <Card key={fb._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="pb-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-slate-900 text-lg">
                              {fb.studentId.FullName}
                            </CardTitle>
                            <CardDescription className="flex items-center text-slate-600">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(fb.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            {renderStars(individualAvg)}
                          </div>
                          <span className="text-slate-900 font-semibold">
                            {individualAvg.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Rating Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                        {Object.entries(fb.ratings).map(([key, value]) => (
                          <div key={key} className="text-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <div className="text-sm text-slate-600 mb-1 capitalize">
                              {key.split('_')[0]}
                            </div>
                            <div className="flex justify-center space-x-1 mb-1">
                              {renderStars(value, "sm")}
                            </div>
                            <div className="text-lg font-semibold text-slate-900">{value}</div>
                          </div>
                        ))}
                      </div>

                      {/* Comments */}
                      {fb.comments && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-start space-x-2">
                            <MessageSquare className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium text-blue-900 mb-1">Student Comments</h4>
                              <p className="text-blue-800 text-sm leading-relaxed">{fb.comments}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowPerformance;