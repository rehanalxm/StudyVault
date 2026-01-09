import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import SubjectSelect from './pages/SubjectSelect';
import MaterialView from './pages/MaterialView';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import NoticeBoard from './pages/NoticeBoard';
import ProtectedRoute from './components/ProtectedRoute';
import { BookOpen, Shield, Code2, Bell, Home as HomeIcon } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Navbar */}
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
                  StudyVault
                </span>
              </Link>
              <div className="flex space-x-1">
                <Link to="/" className="px-4 py-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg font-medium transition-all duration-200 flex items-center space-x-1">
                  <HomeIcon className="h-4 w-4 md:hidden" />
                  <span className="hidden md:inline">Home</span>
                </Link>
                <Link to="/notices" className="flex items-center space-x-1 px-4 py-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg font-medium transition-all duration-200">
                  <Bell className="h-4 w-4" />
                  <span className="hidden sm:inline">Notices</span>
                </Link>
                <Link to="/admin" className="flex items-center space-x-1 px-4 py-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg font-medium transition-all duration-200">
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Admin</span>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/notices" element={<NoticeBoard />} />
            <Route path="/year/:year" element={<SubjectSelect />} />
            <Route path="/subject/:subjectId" element={<MaterialView />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white mt-auto border-t border-gray-200">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-center text-gray-500 text-sm">
                © {new Date().getFullYear()} StudyVault. All rights reserved.
              </p>
              <a
                href="https://rehanportfolio.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-gray-500 hover:text-primary transition-colors group"
              >
                <Code2 className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                <span>Developed by Rehan</span>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;

