'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  GraduationCap, 
  LayoutDashboard, 
  BookOpen, 
  ClipboardCheck, 
  TrendingUp, 
  HelpCircle, 
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, userData, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      current: pathname === '/dashboard'
    },
    {
      name: 'My Lessons',
      href: '/dashboard/lessons',
      icon: BookOpen,
      current: pathname.startsWith('/dashboard/lessons')
    },
    {
      name: 'Assignments',
      href: '/dashboard/assignments',
      icon: ClipboardCheck,
      current: pathname.startsWith('/dashboard/assignments')
    },
    {
      name: 'Progress Reports',
      href: '/dashboard/progress',
      icon: TrendingUp,
      current: pathname.startsWith('/dashboard/progress')
    },
    {
      name: 'WAEC Prep',
      href: '/dashboard/waec-prep',
      icon: HelpCircle,
      current: pathname.startsWith('/dashboard/waec-prep')
    },
    {
      name: 'Account Settings',
      href: '/dashboard/settings',
      icon: Settings,
      current: pathname.startsWith('/dashboard/settings')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Ghana Flag Bar */}
      <div className="h-2 bg-gradient-to-r from-green-600 via-yellow-400 to-red-600"></div>

      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-modern border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold text-gradient">EduMath GH</span>
              </Link>
            </div>
            
            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  placeholder="Search lessons, topics..." 
                  className="pl-10 bg-gray-50/50 border-gray-200 rounded-xl focus:bg-white transition-all duration-300"
                />
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-blue-500 font-medium transition-colors">Home</Link>
              <Link href="/courses" className="text-gray-700 hover:text-blue-500 font-medium transition-colors">Courses</Link>
              <Link href="/resources" className="text-gray-700 hover:text-blue-500 font-medium transition-colors">Resources</Link>
              
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-sm font-medium text-gray-700">
                    {userData?.firstName?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-semibold text-gray-900">{userData?.firstName || 'User'}</p>
                  <p className="text-xs text-gray-500 capitalize">{userData?.role || 'Student'}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-72 bg-white/80 backdrop-blur-md shadow-modern border-r border-gray-200/50 min-h-screen`}>
          <div className="p-6 space-y-6">
            {/* User Profile */}
            <div className="flex items-center pb-6 border-b border-gray-200/50">
              <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <span className="text-white font-semibold">
                  {userData?.firstName?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">
                  {userData?.fullName || 'User'}
                </h3>
                <p className="text-sm text-gray-600 capitalize">{userData?.grade || 'Student'}</p>
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-xs text-green-600 font-medium">Online</span>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-3">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group ${
                      item.current
                        ? 'gradient-primary text-white shadow-lg transform scale-105'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600 hover:transform hover:scale-105'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className={`w-5 h-5 mr-3 transition-transform duration-300 ${item.current ? '' : 'group-hover:scale-110'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
          {children}
          </div>
        </div>
      </div>
    </div>
  );
}