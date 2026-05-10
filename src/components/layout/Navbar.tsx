import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Upload', path: '/upload' },
    { name: 'Detection', path: '/detection' },
    { name: 'Report', path: '/report' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className="fixed top-0 w-full bg-off-white/80 backdrop-blur-md z-50 border-b border-soft-grey">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-charcoal hover:text-muted-purple transition-colors">
          <Shield className="w-6 h-6" />
          <span className="font-semibold tracking-tight text-lg">ArtShield AI</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`transition-colors hover:text-muted-purple ${
                location.pathname === link.path ? 'text-muted-purple font-medium' : 'text-gray-500'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          <Link
            to="/login"
            className="px-4 py-2 bg-charcoal text-off-white rounded-full hover:bg-gray-800 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
};
