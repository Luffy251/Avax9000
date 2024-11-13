import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { path: '/', label: 'Home' },
    { path: '/create-bet', label: 'Create Bet' },
    { path: '/all-bets', label: 'All Bets' },
    { path: '/my-bets', label: 'My Bets' },
    { path: '/created-bets', label:'Created Bets'}
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-gray-900/95 backdrop-blur-md' 
          : 'bg-gray-900/80 backdrop-blur-sm'
      } border-b border-purple-500/10`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400">
              BetWin
            </span>
          </Link>

          {/* Center Navigation - Desktop */}
          <div className="hidden md:block flex-1 mx-8">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-1 bg-black/20 rounded-full p-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className="relative"
                  >
                    <motion.div
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        router.pathname === item.path
                          ? 'text-white'
                          : 'text-gray-300 hover:text-white'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {router.pathname === item.path && (
                        <motion.div
                          layoutId="nav-pill"
                          className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <span className="relative z-10">{item.label}</span>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Section - Connect Button & Mobile Menu */}
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ConnectButton />
            </motion.div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg bg-purple-500/10 text-purple-400 hover:text-purple-300 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-purple-500/10 py-4"
            >
              <div className="flex flex-col space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <motion.div
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        router.pathname === item.path
                          ? 'bg-purple-500/20 text-white'
                          : 'text-gray-300 hover:text-white hover:bg-purple-500/10'
                      }`}
                      whileHover={{ x: 4 }}
                    >
                      {item.label}
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;