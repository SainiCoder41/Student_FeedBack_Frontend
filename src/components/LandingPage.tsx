import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Users, 
  BarChart3, 
  Shield, 
  Clock, 
  CheckCircle, 
  Star,
  TrendingUp,
  Zap,
  Brain,
  MessageSquare,
  Award,
  ChevronRight,
  Sparkles,
  Orbit,
  Globe
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const FloatingOrbs = () => {
  const orbs = [
    { color: 'from-blue-400 to-cyan-400', size: 'w-64 h-64', delay: 0 },
    { color: 'from-purple-400 to-pink-400', size: 'w-48 h-48', delay: 2 },
    { color: 'from-green-400 to-emerald-400', size: 'w-32 h-32', delay: 4 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {orbs.map((orb, index) => (
        <motion.div
          key={index}
          className={`absolute bg-gradient-to-br ${orb.color} rounded-full blur-3xl opacity-20 ${orb.size}`}
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            left: `${20 + index * 25}%`,
            top: `${30 + index * 20}%`,
          }}
        />
      ))}
    </div>
  );
};

const AnimatedParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-primary rounded-full"
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
        />
      ))}
    </div>
  );
};

const InteractiveGlobe = () => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const globeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!globeRef.current) return;
      
      const rect = globeRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      setRotation({
        x: y * 30,
        y: -x * 30,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      ref={globeRef}
      className="relative w-64 h-64 mx-auto mb-8"
      animate={{ rotateY: rotation.y, rotateX: rotation.x }}
      transition={{ type: "spring", stiffness: 100, damping: 10 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-2xl shadow-blue-500/50">
        <div className="absolute inset-4 bg-gradient-to-tr from-cyan-400 to-blue-500 rounded-full opacity-30" />
        <div className="absolute inset-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-20" />
        
        {/* Grid lines */}
        <div className="absolute inset-0 rounded-full border-2 border-white/10">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10 transform -translate-y-1/2" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 transform -translate-x-1/2" />
        </div>
        
        {/* Floating elements */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-4 h-4 bg-yellow-400 rounded-full shadow-lg"
          animate={{ y: [0, -10, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-green-400 rounded-full shadow-lg"
          animate={{ y: [0, 8, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        />
      </div>
      <Sparkles className="absolute -top-4 -right-4 w-8 h-8 text-yellow-400" />
    </motion.div>
  );
};

const MorphingText = () => {
  const texts = ["Student Feedback", "Teacher Insights", "Academic Excellence", "Institutional Growth"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-20 sm:h-24 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          className="block text-4xl sm:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {texts[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

const HolographicCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
      <div className="relative bg-background rounded-lg border border-border/50">
        {children}
      </div>
    </div>
  );
};

const LandingPage = ({ onGetStarted }: LandingPageProps) => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: BookOpen,
      title: "Digital Feedback Collection",
      description: "Replace paper-based feedback with secure, fast, and analyzable digital workflows"
    },
    {
      icon: Users,
      title: "Role-Based Access Control", 
      description: "Separate portals for Students, Teachers, and Administrators with appropriate permissions"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Generate comprehensive reports with charts, graphs, and AI-powered insights"
    },
    {
      icon: Shield,
      title: "Secure & Anonymous",
      description: "Anonymous feedback submission with robust security measures and data protection"
    }
  ];

  const stats = [
    { number: "95%", label: "Time Saved", icon: Clock },
    { number: "100%", label: "Digital Accuracy", icon: CheckCircle },
    { number: "4.9/5", label: "User Rating", icon: Star },
    { number: "50K+", label: "Feedback Collected", icon: TrendingUp }
  ];

  const modules = [
    {
      title: "Student Portal",
      description: "Easy-to-use interface for students to submit feedback about teachers, subjects, and facilities",
      features: ["Teacher Selection", "Interactive Forms", "Anonymous Submission", "Real-time Updates"],
      color: "from-blue-500 to-cyan-500",
      icon: Users
    },
    {
      title: "Admin Dashboard", 
      description: "Comprehensive management system for administrators with powerful analytics",
      features: ["User Management", "Report Generation", "AI Insights", "Export Tools"],
      color: "from-purple-500 to-pink-500",
      icon: BarChart3
    },
    {
      title: "Teacher Panel",
      description: "Dedicated portal for teachers to view their feedback and performance metrics",
      features: ["Performance Overview", "Feedback Analysis", "Improvement Suggestions", "Trend Monitoring"],
      color: "from-green-500 to-emerald-500",
      icon: Award
    }
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated Background */}
      <FloatingOrbs />
      <AnimatedParticles />

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="border-b border-border/50 backdrop-blur-xl bg-background/80 sticky top-0 z-50"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(120, 119, 198, 0.1) 0%, transparent 50%)`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-30"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FeedbackPro
              </span>
            </motion.div>
            
            <NavLink to="/login">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-purple-500/25">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Access Portal
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </Button>
              </motion.div>
            </NavLink>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 backdrop-blur-sm">
              <Sparkles className="w-3 h-3 mr-1" />
              Next-Gen Educational Feedback System
            </Badge>
          </motion.div>

          <motion.h1 
            className="text-4xl sm:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Transform Your
            <MorphingText />
          </motion.h1>

          <motion.p 
            className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Modernize feedback collection with our AI-powered platform. Reduce paperwork, 
            increase accuracy, and generate actionable insights for educational excellence.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <NavLink 
            to="/login">
 <Button 
              size="lg" 
              onClick={onGetStarted}
              className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-purple-500/25 overflow-hidden group"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Get Started Now
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </Button>
            </NavLink>
           
            <Button size="lg" variant="outline" className="border-primary/20 hover:bg-primary/10 backdrop-blur-sm">
              <Orbit className="w-4 h-4 mr-2" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Interactive Globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 1 }}
          >
            <InteractiveGlobe />
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            {stats.map((stat, index) => (
              <HolographicCard key={index} className="group cursor-pointer">
                <CardContent className="p-6 text-center">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <stat.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                  </motion.div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </HolographicCard>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Powerful Features for Modern Education
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to collect, analyze, and act on student feedback effectively.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <HolographicCard className="h-full cursor-pointer">
                  <CardContent className="p-6 text-center h-full flex flex-col">
                    <motion.div 
                      className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25"
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <feature.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed flex-grow">
                      {feature.description}
                    </p>
                  </CardContent>
                </HolographicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Three Powerful Modules
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tailored experiences for every user type in your educational institution.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {modules.map((module, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ y: -10 }}
              >
                <HolographicCard className="h-full">
                  <CardHeader>
                    <motion.div 
                      className={`w-full h-32 bg-gradient-to-br ${module.color} rounded-lg mb-4 flex items-center justify-center relative overflow-hidden`}
                      whileHover={{ scale: 1.05 }}
                    >
                      <module.icon className="w-12 h-12 text-white z-10" />
                      <div className="absolute inset-0 bg-white/10 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    </motion.div>
                    <CardTitle className="text-xl">{module.title}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {module.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {module.features.map((feature, featureIndex) => (
                        <motion.div 
                          key={featureIndex}
                          className="flex items-center space-x-2"
                          whileHover={{ x: 5 }}
                        >
                          <CheckCircle className="w-4 h-4 text-primary" />
                          <span className="text-sm">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </HolographicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Innovation Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              AI-Powered Innovation
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Cutting-edge features that set us apart from traditional feedback systems.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Brain, title: "AI Sentiment Analysis", description: "Automatic analysis of text feedback to identify sentiment trends" },
              { icon: MessageSquare, title: "Voice Feedback", description: "Record and transcribe voice feedback for better insights" },
              { icon: Zap, title: "Real-time Alerts", description: "Instant notifications for critical feedback patterns" },
              { icon: Award, title: "Gamification", description: "Reward system to encourage active student participation" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05, rotateY: 10 }}
                className="cursor-pointer"
              >
                <HolographicCard>
                  <CardContent className="p-6 text-center">
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <item.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </HolographicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-black/10 to-black/20" />
        <AnimatedParticles />
        
        <motion.div 
          className="max-w-4xl mx-auto text-center relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            Ready to Transform Your Feedback Process?
          </h2>
          <p className="text-xl opacity-90 mb-8 text-white/90">
            Join thousands of educational institutions already using FeedbackPro
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              size="lg" 
              onClick={onGetStarted}
              className="bg-white text-primary hover:bg-gray-100 shadow-lg font-semibold relative overflow-hidden group"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Access Portal Now
              <ChevronRight className="w-4 h-4 ml-2" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-4 sm:px-6 lg:px-8 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div 
            className="flex items-center justify-center space-x-3 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-30"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FeedbackPro
            </span>
          </motion.div>
          <motion.p 
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            © 2024 FeedbackPro. Transforming education through intelligent feedback systems.
          </motion.p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;