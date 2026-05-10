import React from 'react';
import { Navbar } from './Navbar';
import { motion } from 'framer-motion';

interface PageLayoutProps {
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen relative flex flex-col">
      <div className="fixed inset-0 bg-sketch pointer-events-none z-0"></div>
      <Navbar />
      <motion.main 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex-grow pt-24 pb-12 px-6 max-w-6xl mx-auto w-full relative z-10"
      >
        {children}
      </motion.main>
    </div>
  );
};
