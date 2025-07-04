import React from 'react';
import { Shield, Zap, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';

interface HeaderProps {
  onGoToPortal?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onGoToPortal }) => {
  const { user, signOut } = useAuth();
  const { activePlan } = useSubscription();

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-3">
            <div className="text-2xl font-gotham-light text-black tracking-tight">
              SunLink
            </div>
          </div>
          
          <div className="flex items-center space-x-8">
            <div className="hidden sm:flex items-center space-x-6 text-sm text-gray-600 font-gotham-book">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>25-Year Warranty</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>Instant Activation</span>
              </div>
            </div>
            
            {user && (
              <div className="flex items-center space-x-4 pl-6 border-l border-gray-200">
                {onGoToPortal && (
                  <button
                    onClick={onGoToPortal}
                    className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 transition-colors font-gotham-book"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="hidden sm:inline">Customer Portal</span>
                  </button>
                )}
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="text-sm font-gotham-book">
                    <div className="font-gotham-medium text-gray-900 hidden sm:block">
                      {user.user_metadata?.full_name || user.email}
                    </div>
                    <div className="font-gotham-medium text-gray-900 sm:hidden">
                      {user.user_metadata?.first_name || user.email?.split('@')[0]}
                    </div>
                    {activePlan && (
                      <div className="text-xs text-gray-500 font-gotham-book">{activePlan}</div>
                    )}
                  </div>
                </div>
                <button
                  onClick={signOut}
                  className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors font-gotham-book"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;