import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  FileText,
  Settings,
  BarChart3,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  MapPin,
  Camera,
} from "lucide-react";
import { auth } from "../../services/firebase";
import sunlinkLogo from "../../../images/solar_panels/sunlink_logo.png";

interface CustomerPortalLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout component for the Customer Portal
 * Provides navigation and consistent UI across portal pages
 */
export const CustomerPortalLayout: React.FC<CustomerPortalLayoutProps> = ({
  children,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation items
  const navItems = [
    {
      name: "Dashboard",
      path: "/portal",
      icon: <Home size={20} />,
    },
    {
      name: "Site Survey",
      path: "/portal/sitesurvey",
      icon: <Camera size={20} />,
    },
    {
      name: "Documents",
      path: "/portal/documents",
      icon: <FileText size={20} />,
    },
    {
      name: "Settings",
      path: "/portal/settings",
      icon: <Settings size={20} />,
    },
  ];

  // Handle user logout
  const handleLogout = async () => {
    try {
      await auth.signOut();
      // Redirect to home page
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#0a0a0a] to-black flex flex-col ">
      {/* Animated light sources - positioned to cover entire viewport */}
      <div
        className="absolute z-10 top-0 right-0 w-[100%] h-[100dvh] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at top right, rgba(255, 255, 255, 0.2), transparent 70%)",
          opacity: 0.7,
          mixBlendMode: "screen",
        }}
      />

      <motion.div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at top right, rgba(85, 201, 247, 0.2), transparent 70%)",
          mixBlendMode: "screen",
        }}
        animate={{
          opacity: [0.3, 0.3, 0.3],
          background: [
            "radial-gradient(circle at top right, rgba(145, 78, 252, 0.4), transparent 70%)",
            "radial-gradient(circle at top right, rgba(0, 83, 207, 0.6), transparent 70%)",
            "radial-gradient(circle at top right, rgba(145, 78, 252, 0.4), transparent 70%)",
            "radial-gradient(circle at top right, rgba(0, 83, 207, 0.6), transparent 70%)",
            "radial-gradient(circle at top right, rgba(145, 78, 252, 0.4), transparent 70%)",
          ],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Top navigation bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/portal">
                <motion.img
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  src={sunlinkLogo}
                  alt="Unlimited Energy"
                  className="h-7 w-auto transition-opacity duration-300 hover:opacity-90 "
                />
              </Link>
            </div>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    location.pathname === item.path
                      ? "text-white text-glow-white"
                      : "text-white/70 hover:text-white hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {React.cloneElement(item.icon, {
                      className:
                        location.pathname === item.path
                          ? "icon-glow-white"
                          : "",
                    })}
                    <span>{item.name}</span>
                  </div>
                </Link>
              ))}
            </nav>

            {/* User menu */}
            <div className="hidden md:flex items-center gap-2">
              <button
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors relative"
                title="Notifications"
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
              </button>

              <button
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-white/70 hover:text-white focus:outline-none"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/90 pt-20">
          <nav className="px-4 pt-2 pb-5 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg ${
                  location.pathname === item.path
                    ? "text-white text-glow-white"
                    : "text-white/70 hover:text-white hover:text-white"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {React.cloneElement(item.icon, {
                  className:
                    location.pathname === item.path ? "icon-glow-white" : "",
                })}
                <span>{item.name}</span>
              </Link>
            ))}

            <div className="border-t border-white/10 my-4 pt-4">
              <button
                className="flex items-center w-full gap-3 px-4 py-3 text-base font-medium rounded-lg text-white/70 hover:text-white hover:bg-white/10"
                onClick={handleLogout}
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* Main content */}
      <main className="pt-20 px-4 max-w-7xl mx-auto w-full flex-grow flex flex-col justify-center py-12 relative z-10">
        {children}
      </main>
    </div>
  );
};
