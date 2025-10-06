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
  Globe,
  GraduationCap,
  Library,
  University
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const FloatingOrbs = () => {
  const orbs = [
    { color: 'from-blue-50 to-cyan-50', size: 'w-64 h-64', delay: 0 },
    { color: 'from-slate-50 to-gray-50', size: 'w-48 h-48', delay: 2 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {orbs.map((orb, index) => (
        <motion.div
          key={index}
          className={`absolute bg-gradient-to-br ${orb.color} rounded-full blur-3xl opacity-60 ${orb.size}`}
          animate={{
            x: [0, 50, 0],
            y: [0, -25, 0],
          }}
          transition={{
            duration: 15,
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
  const particles = Array.from({ length: 15 }, (_, i) => ({
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
          className="absolute w-1 h-1 bg-blue-200 rounded-full"
          animate={{
            y: [0, -80, 0],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 4,
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

const AcademicBadge = () => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!badgeRef.current) return;
      
      const rect = badgeRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      setRotation({
        x: y * 10,
        y: -x * 10,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      ref={badgeRef}
      className="relative w-48 h-48 mx-auto mb-8"
      animate={{ rotateY: rotation.y, rotateX: rotation.x }}
      transition={{ type: "spring", stiffness: 50, damping: 10 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-slate-100 rounded-full shadow-lg border border-gray-200">
        <div className="absolute inset-4 bg-white rounded-full opacity-80 border border-gray-100" />
        
        <div className="absolute inset-0 rounded-full border-2 border-blue-200/30">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-blue-200/50 transform -translate-y-1/2" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-blue-200/50 transform -translate-x-1/2" />
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <GraduationCap className="w-16 h-16 text-blue-700" />
        </div>
        
        <motion.div
          className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-400 rounded-full shadow-sm"
          animate={{ y: [0, -5, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-slate-400 rounded-full shadow-sm"
          animate={{ y: [0, 4, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        />
      </div>
    </motion.div>
  );
};

const MorphingText = () => {
  const texts = ["Student Feedback", "Faculty Insights", "Academic Excellence", "Institutional Growth"];
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
          className="block text-4xl sm:text-6xl font-bold bg-gradient-to-r from-blue-800 to-slate-800 bg-clip-text text-transparent"
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

const AcademicCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`relative bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-50 to-slate-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative bg-white rounded-lg border border-gray-200">
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
      description: "Replace paper-based feedback with secure, efficient digital workflows designed for academic institutions"
    },
    {
      icon: Users,
      title: "Role-Based Access Control", 
      description: "Dedicated portals for Students, Faculty, and Administrators with appropriate permissions and privacy controls"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Generate comprehensive academic reports with detailed charts, graphs, and actionable insights"
    },
    {
      icon: Shield,
      title: "Secure & Confidential",
      description: "Anonymous feedback submission with enterprise-grade security measures and data protection"
    }
  ];

  const stats = [
    { number: "95%", label: "Time Saved", icon: Clock },
    { number: "100%", label: "Digital Accuracy", icon: CheckCircle },
    { number: "4.8/5", label: "Satisfaction Rate", icon: Star },
    { number: "50K+", label: "Feedback Processed", icon: TrendingUp }
  ];

  const modules = [
    {
      title: "Student Portal",
      description: "Intuitive interface for students to provide feedback about courses, faculty, and campus facilities",
      features: ["Course Selection", "Structured Forms", "Anonymous Submission", "Confirmation Tracking"],
      color: "from-blue-500 to-blue-600",
      icon: Users
    },
    {
      title: "Administrative Dashboard", 
      description: "Comprehensive management system for academic administrators with institutional analytics",
      features: ["User Management", "Report Generation", "Trend Analysis", "Export Capabilities"],
      color: "from-slate-600 to-slate-700",
      icon: BarChart3
    },
    {
      title: "Faculty Panel",
      description: "Dedicated portal for faculty to review feedback and track professional development progress",
      features: ["Performance Metrics", "Feedback Analysis", "Improvement Tracking", "Department Benchmarks"],
      color: "from-blue-600 to-slate-600",
      icon: Award
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Subtle Background */}
      <FloatingOrbs />
      <AnimatedParticles />

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="border-b border-gray-200 backdrop-blur-sm bg-white/90 sticky top-0 z-50"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.05) 0%, transparent 50%)`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-700 to-slate-800 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/10">
                  <University className="w-6 h-6 text-white" />
                </div>
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-slate-700 rounded-xl blur opacity-20"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <span className="text-xl font-bold text-slate-900">
                EduFeedback Pro
              </span>
            </motion.div>
            
            <NavLink to="/login">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="bg-blue-700 hover:bg-blue-800 text-white shadow-lg shadow-blue-500/20 border border-blue-600">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Access Portal
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
            <Badge className="mb-6 bg-blue-50 text-blue-700 border border-blue-200 backdrop-blur-sm">
              <Sparkles className="w-3 h-3 mr-1" />
              Academic Feedback Management System
            </Badge>
          </motion.div>

          <motion.h1 
            className="text-4xl sm:text-6xl font-bold mb-6 text-slate-900"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Enhance Academic
            <MorphingText />
          </motion.h1>

          <motion.p 
            className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Streamline feedback collection with our purpose-built academic platform. Reduce administrative workload, 
            ensure data accuracy, and generate meaningful insights to support institutional excellence and continuous improvement.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <NavLink to="/login">
              <Button 
                size="lg" 
                onClick={onGetStarted}
                className="bg-blue-700 hover:bg-blue-800 text-white shadow-lg shadow-blue-500/20 border border-blue-600"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Get Started
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </NavLink>
           
          
          </motion.div>

          {/* Academic Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 1 }}
          >
            <AcademicBadge />
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            {stats.map((stat, index) => (
              <AcademicCard key={index} className="group cursor-pointer">
                <CardContent className="p-6 text-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  </motion.div>
                  <div className="text-2xl font-bold text-slate-900">
                    {stat.number}
                  </div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </CardContent>
              </AcademicCard>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900">
              Comprehensive Academic Features
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Designed specifically for higher education institutions to streamline feedback processes.
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
                <AcademicCard className="h-full cursor-pointer">
                  <CardContent className="p-6 text-center h-full flex flex-col">
                    <motion.div 
                      className="w-16 h-16 bg-gradient-to-br from-blue-600 to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/10"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <feature.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-3 text-slate-900">{feature.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed flex-grow">
                      {feature.description}
                    </p>
                  </CardContent>
                </AcademicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900">
              Three Integrated Modules
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Tailored experiences for every stakeholder in your academic community.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {modules.map((module, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <AcademicCard className="h-full">
                  <CardHeader className="pb-4">
                    <motion.div 
                      className={`w-full h-32 bg-gradient-to-br ${module.color} rounded-lg mb-4 flex items-center justify-center relative overflow-hidden`}
                      whileHover={{ scale: 1.02 }}
                    >
                      <module.icon className="w-12 h-12 text-white z-10" />
                      <div className="absolute inset-0 bg-white/10 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    </motion.div>
                    <CardTitle className="text-xl text-slate-900">{module.title}</CardTitle>
                    <CardDescription className="text-slate-600">
                      {module.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {module.features.map((feature, featureIndex) => (
                        <motion.div 
                          key={featureIndex}
                          className="flex items-center space-x-3"
                          whileHover={{ x: 3 }}
                        >
                          <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <span className="text-sm text-slate-700">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </AcademicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Innovation Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900">
              Advanced Academic Tools
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Innovative features designed to support educational excellence and continuous improvement.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Brain, title: "Sentiment Analysis", description: "Automated analysis of qualitative feedback to identify key themes and sentiment trends" },
              { icon: MessageSquare, title: "Structured Feedback", description: "Organized feedback collection with standardized rubrics and rating scales" },
              { icon: Zap, title: "Real-time Reporting", description: "Instant access to feedback data and analytics for timely decision-making" },
              { icon: Award, title: "Benchmarking", description: "Compare performance metrics across departments and academic periods" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
                className="cursor-pointer"
              >
                <AcademicCard>
                  <CardContent className="p-6 text-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <item.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-lg font-semibold mb-2 text-slate-900">{item.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </AcademicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-800 via-slate-800 to-blue-900" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-slate-900/50 to-slate-900" />
        <AnimatedParticles />
        
        <motion.div 
          className="max-w-4xl mx-auto text-center relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            Ready to Transform Academic Feedback?
          </h2>
          <p className="text-xl opacity-90 mb-8 text-slate-200">
            Join leading educational institutions using EduFeedback Pro to enhance their feedback processes
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
          
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div 
            className="flex items-center justify-center space-x-3 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-700 to-slate-800 rounded-lg flex items-center justify-center">
                <University className="w-5 h-5 text-white" />
              </div>
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-slate-700 rounded-lg blur opacity-20"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <span className="text-lg font-bold text-slate-900">
              EduFeedback Pro
            </span>
          </motion.div>
          <motion.p 
            className="text-slate-600"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            © 2024 EduFeedback Pro. Supporting academic excellence through intelligent feedback systems.
          </motion.p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;