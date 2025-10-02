import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axiosClient from "@/utils/axiosClient";
import { useState, useEffect } from "react";
import { 
  UserPlus, 
  BarChart3, 
  LogOut, 
  Users, 
  TrendingUp, 
  Shield,
  Settings,
  Database,
  Activity,
  GraduationCap,
  BookOpen,
  PieChart,
  AlertCircle
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ FullName: string; role: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTeachers: 0,
    totalStudents: 0,
    feedbackSubmitted: 0
  });

  // Fetch current user and stats on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await axiosClient.post("/user/me", {}, { withCredentials: true });
        setUser(res.data.user);

        // Fetch additional stats (you might need to create these endpoints)
        // Example: const statsRes = await axiosClient.get("/admin/stats");
        // setStats(statsRes.data);
      } catch (err) {
        console.error(err);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  // Logout handler
  const handleLogout = async () => {
    try {
      await axiosClient.post("/user/logout", {}, { withCredentials: true });
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Logout failed");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <Shield className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Loading Admin Portal</h2>
          <p className="text-slate-600">Initializing system dashboard...</p>
        </div>
      </div>
    );
  }
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-slate-600 rounded-xl flex items-center justify-center shadow-md">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Admin Portal</h1>
                <p className="text-slate-600 text-sm">Welcome, {user?.FullName}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-6 text-sm text-slate-600">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>{stats.totalUsers} Users</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  <span>{stats.feedbackSubmitted} Feedbacks</span>
                </div>
              </div>
              
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-slate-600 text-sm">Total Users</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-slate-600 text-sm">Teachers</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalTeachers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-slate-600 text-sm">Students</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalStudents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-slate-600 text-sm">Feedbacks</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.feedbackSubmitted}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Database className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Data Management</h3>
                  <p className="text-sm text-slate-600">Manage system data</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                  <Settings className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">System Settings</h3>
                  <p className="text-sm text-slate-600">Configure preferences</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Security</h3>
                  <p className="text-sm text-slate-600">Access controls</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Register New User Card */}
          <Card className="bg-white border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-md">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900">
                  Register New User
                </CardTitle>
              </div>
              <p className="text-slate-600 text-sm">
                Add new teachers or students to the system
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 mb-6 leading-relaxed">
                Add new Teachers or Students with comprehensive details including Full Name, 
                Enrollment Number, Batch, Branch, and Role assignments. Manage user accounts 
                and permissions seamlessly.
              </p>
              <Button 
                onClick={() => navigate("/register-new")}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Go to Registration Portal
              </Button>
            </CardContent>
          </Card>

          {/* Teacher Performance Card */}
          <Card className="bg-white border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900">
                  Performance Analytics
                </CardTitle>
              </div>
              <p className="text-slate-600 text-sm">
                Monitor teacher performance and feedback
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 mb-6 leading-relaxed">
                Access comprehensive teacher performance data with interactive charts, 
                detailed analytics, and insights. Monitor feedback trends, rating distributions, 
                and performance metrics in real-time.
              </p>
              <Button 
                onClick={() => navigate("/performance")}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                View Performance Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Section */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 bg-slate-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserPlus className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">New user registered</p>
                  <p className="text-xs text-slate-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-slate-50 rounded-lg">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">Feedback submitted</p>
                  <p className="text-xs text-slate-500">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-slate-50 rounded-lg">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <PieChart className="w-4 h-4 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">Performance report generated</p>
                  <p className="text-xs text-slate-500">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center">
          <p className="text-slate-600 text-sm">
            © {new Date().getFullYear()} Admin Portal • Secure Management System
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;