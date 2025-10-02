import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import type { RootState, AppDispatch } from "./redux/store";

import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import StudentDashboard from "./components/StudentDashboard";
import TeacherDashboard from "./components/TeacherDashboard";
import AdminDashboard from "./components/AdminDashboard";
import Performance from "./components/Performance";
import { fetchCurrentUser } from "@/redux/slices/userSlice";
import Register from "./components/Register";
import ShowPerformance from "./components/ShowPerformance";

const queryClient = new QueryClient();

function AppRoutes() {
  const { isAuthenticated, user, loading } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  // ✅ fetch user on mount
  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route
        path="/login"
        element={
          isAuthenticated
            ? user?.role === "Student"
              ? <StudentDashboard />
              : user?.role === "Teacher"
                ? <TeacherDashboard />
                : <AdminDashboard />
            : <LoginPage />
        }
      />

      <Route path="/student-dashboard" element={isAuthenticated && user?.role === "Student" ? <StudentDashboard /> : <Navigate to="/login" replace />} />
      <Route path="/teacher-dashboard" element={isAuthenticated && user?.role === "Teacher" ? <TeacherDashboard /> : <Navigate to="/login" replace />} />
      <Route path="/admin-dashboard" element={isAuthenticated && user?.role === "Admin" ? <AdminDashboard /> : <Navigate to="/login" replace />} />
      <Route path="/register-new" element={isAuthenticated && user?.role === "Admin" ? <Register /> : <Navigate to="/login" replace />} />
      <Route path="/performance" element={isAuthenticated && user?.role === "Admin" ? <Performance /> : <Navigate to="/login" replace />}></Route>

      <Route path="/showPerformance/:T" element={isAuthenticated && user?.role === "Admin" ? <ShowPerformance /> : <Navigate to="/login" replace />}></Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="dark">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
