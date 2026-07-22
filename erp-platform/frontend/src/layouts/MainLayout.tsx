import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Breadcrumbs from './components/Breadcrumbs';
import Footer from './components/Footer';

const { Content } = Layout;

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const pageVariants: Variants = {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.5, 
        ease: "easeOut",
        staggerChildren: 0.1 
      } 
    },
    exit: { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.3 } }
  };

  if (!mounted) return null;

  return (
    <Layout className="min-h-screen premium-gradient-bg relative overflow-hidden">
      {/* Immersive Background Animated Blobs for "Wow" Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-500/20 dark:bg-indigo-600/10 mix-blend-multiply dark:mix-blend-lighten filter blur-[120px] animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-500/20 dark:bg-purple-600/10 mix-blend-multiply dark:mix-blend-lighten filter blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-pink-500/20 dark:bg-pink-600/10 mix-blend-multiply dark:mix-blend-lighten filter blur-[120px] animate-blob animation-delay-4000" />
      </div>

      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} className="glass-panel border-r border-white/20 dark:border-white/5 z-20" />
      
      <Layout className="bg-transparent z-10 relative">
        <Header collapsed={collapsed} onCollapse={setCollapsed} className="glass-panel sticky top-0 z-50 backdrop-blur-2xl bg-white/70 dark:bg-[#09090b]/70 border-b border-white/20 dark:border-white/5" />
        
        <Content className="mx-6 my-6 transition-all duration-300 flex flex-col relative z-10">
          <Breadcrumbs />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="mt-6 flex-1 flex flex-col"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
}
