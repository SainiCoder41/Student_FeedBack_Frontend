import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import LandingPage from '@/components/LandingPage';
import LoginPage from '@/components/LoginPage';
import AdminDashboard from '@/components/AdminDashboard';
import StudentDashboard from '@/components/StudentDashboard';
import TeacherDashboard from '@/components/TeacherDashboard';
import { setUser } from '@/redux/slices/userSlice';
import axiosClient from '@/utils/axiosClient';

const Index = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const [currentView, setCurrentView] = useState<'landing' | 'login'>('landing');

  // On mount, check if user is already logged in via JWT cookie
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosClient.get('/user/me', { withCredentials: true });
        dispatch(setUser(res.data.user));
      } catch (err) {
        // Not logged in
        setCurrentView('landing');
      }
    };
    fetchUser();
  }, [dispatch]);

  const handleGetStarted = () => setCurrentView('login');

  // Render Dashboard if user exists
  if (user) {
    switch (user.role) {
      case 'Admin':
        return <AdminDashboard onLogout={() => dispatch(setUser(null))} />;
      case 'Student':
        return <StudentDashboard onLogout={() => dispatch(setUser(null))} />;
      case 'Teacher':
        return <TeacherDashboard onLogout={() => dispatch(setUser(null))} />;
      default:
        return <LoginPage />;
    }
  }

  // Show LoginPage or LandingPage if not authenticated
  if (currentView === 'login') {
    return <LoginPage />;
  }

  return <LandingPage onGetStarted={handleGetStarted} />;
};

export default Index;
