import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { ProgressProvider } from './context/ProgressContext';
import { ThemeProvider } from './context/ThemeContext';
import contentData from './data/content.json';
import './App.css';
import { 
  Home as HomeIcon, 
  AlertTriangle, 
  ArrowLeft, 
  Search,
  Code,
  Bug
} from 'lucide-react';

// Lazy load components for better performance
const Home = lazy(() => import('./components/Pages/Home'));
const SheetList = lazy(() => import('./components/Content/SheetList'));
const SheetView = lazy(() => import('./components/Content/SheetView'));
const ContactUs = lazy(() => import('./components/Pages/ContactUs'));
const MainLayout = lazy(() => import('./components/Layout/MainLayout'));
const WelcomeScreen = lazy(() => import('./components/Pages/WelcomeScreen'));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
);

// Main App Component with Routing
function App() {
  const [showWelcome, setShowWelcome] = useState(() => {
    const welcomeShown = sessionStorage.getItem('welcomeShown');
    return !welcomeShown;
  });

  const handleWelcomeComplete = () => {
    sessionStorage.setItem('welcomeShown', 'true');
    setShowWelcome(false);
  };

  if (showWelcome) {
    return (
      <Suspense fallback={<PageLoader />}>
        <WelcomeScreen onLoadingComplete={handleWelcomeComplete} />
      </Suspense>
    );
  }

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <AuthProvider>
          <ProgressProvider>
            <Router>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/sheets" element={<SheetsPage />} />
                  <Route path="/sheet/:sheetId" element={<SheetDetailsPage />} />
                  <Route path="/contact" element={<ContactUsPage />} />
                  {/* Remove OAuth callback route - not needed for popup */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </Router>
          </ProgressProvider>
        </AuthProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

// Keep all your existing page components unchanged
const HomePage = React.memo(() => (
  <MainLayout>
    <Home />
  </MainLayout>
));

const SheetsPage = React.memo(() => {
  const navigate = useNavigate();

  const handleSheetSelect = (sheetId) => {
    navigate(`/sheet/${sheetId}`);
  };

  return (
    <MainLayout>
      <SheetList
        content={contentData}
        onSheetSelect={handleSheetSelect}
      />
    </MainLayout>
  );
});

const SheetDetailsPage = React.memo(() => {
  const navigate = useNavigate();
  const { sheetId } = useParams();

  const handleBackToSheets = () => {
    navigate('/sheets');
  };

  const getCurrentSheet = () => {
    return contentData.sheets.find(sheet => sheet.id === sheetId);
  };

  const sheet = getCurrentSheet();

  if (!sheet) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 sm:p-12">
              
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-red-500" />
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Sheet Not Found
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                The sheet you're looking for doesn't exist or may have been moved. 
                Let's get you back to exploring other problem sets.
              </p>
              
              <div className="space-y-3">
                <button 
                  onClick={handleBackToSheets}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to All Sheets</span>
                </button>
                
                <button 
                  onClick={() => navigate('/')}
                  className="w-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <HomeIcon className="w-4 h-4" />
                  <span>Go Home</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <SheetView sheet={sheet} />
    </MainLayout>
  );
});

const ContactUsPage = React.memo(() => (
  <MainLayout>
    <ContactUs />
  </MainLayout>
));

const NotFoundPage = React.memo(() => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 sm:p-12">
            
            <div className="mb-8">
              <div className="relative">
                <div className="text-8xl sm:text-9xl font-bold text-gray-200 dark:text-gray-700 select-none">
                  404
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center animate-bounce">
                    <AlertTriangle className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Page Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Oops! The page you're looking for seems to have wandered off into the digital void. 
              Don't worry, even the best algorithms sometimes take wrong turns.
            </p>
            
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <Bug className="w-4 h-4 mr-2 text-blue-500" />
                What you can do:
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>• Check the URL for any typos</li>
                <li>• Go back to the previous page</li>
                <li>• Start fresh from our homepage</li>
                <li>• Browse our problem sheets</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/')}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
              >
                <HomeIcon className="w-4 h-4" />
                <span>Go Home</span>
              </button>
              
              <button 
                onClick={() => navigate('/sheets')}
                className="w-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Code className="w-4 h-4" />
                <span>Browse Sheets</span>
              </button>
              
              <button 
                onClick={() => window.history.back()}
                className="w-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium py-3 transition-colors duration-200"
              >
                ← Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
});

export default App;
