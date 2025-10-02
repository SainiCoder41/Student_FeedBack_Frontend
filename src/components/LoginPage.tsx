import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Shield, Zap, GraduationCap, BookOpen, User, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "@/redux/slices/userSlice";
import type { AppDispatch } from "@/redux/store";
import '../Login.css'

const LoginPage = () => {
  const [EndrollmentNumber, setEndrollmentNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!EndrollmentNumber || !password) {
      toast({
        title: "Missing Credentials",
        description: "Please enter both Enrollment Number and password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const user = await dispatch(loginUser({ EndrollmentNumber, password })).unwrap();

      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.FullName}!`,
        className: "bg-emerald-50 border-emerald-200 text-emerald-900"
      });

      // Navigate based on role
      if (user.role === "Student") navigate("/student-dashboard");
      else if (user.role === "Teacher") navigate("/teacher-dashboard");
      else if (user.role === "Admin") navigate("/admin-dashboard");
      else navigate("/");

    } catch (err: any) {
      toast({
        title: "Authentication Failed",
        description: err?.message || "Invalid enrollment number or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200 rounded-full blur-3xl opacity-40 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-30 animate-pulse delay-500"></div>
        
        {/* Floating Icons */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-slate-300 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          >
            {i % 3 === 0 ? <GraduationCap className="w-6 h-6" /> : 
             i % 3 === 1 ? <BookOpen className="w-6 h-6" /> : 
             <User className="w-6 h-6" />}
          </div>
        ))}
      </div>

      <Card className="w-full max-w-md relative z-10 bg-white/80 backdrop-blur-lg border-slate-200 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
        <CardHeader className="text-center space-y-6 pb-8">
          {/* Logo */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
              <Shield className="w-10 h-10 text-white" />
              <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-yellow-400 fill-current" />
            </div>
          </div>
          
          {/* Title */}
          <div className="space-y-3">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-slate-600 text-lg">
              Student Feedback System
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Enrollment Number Field */}
            <div className="space-y-3">
              <Label htmlFor="EndrollmentNumber" className="text-slate-700 font-medium text-sm">
                Enrollment Number
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input 
                  id="EndrollmentNumber" 
                  type="text" 
                  value={EndrollmentNumber} 
                  onChange={(e) => setEndrollmentNumber(e.target.value)} 
                  placeholder="Enter your enrollment number"
                  className="pl-10 h-12 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500 transition-colors bg-white/50"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-3">
              <Label htmlFor="password" className="text-slate-700 font-medium text-sm">
                Password
              </Label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Enter your password"
                  className="pl-10 pr-20 h-12 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500 transition-colors bg-white/50"
                  disabled={isLoading}
                />
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="absolute right-1 top-1 h-10 px-3 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                </Button>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:hover:scale-100"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing In...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  <span>Access Dashboard</span>
                </div>
              )}
            </Button>
          </form>

          {/* Footer Note */}
          <div className="text-center pt-4 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              Secure login powered by institutional credentials
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Custom CSS for animations */}
    
    </div>
  );
};

export default LoginPage;