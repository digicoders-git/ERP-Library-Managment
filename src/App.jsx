import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Login';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import BookTransactions from './pages/BookTransactions';
import Members from './pages/Members';
import Students from './pages/Students';
import { Reports } from './pages/Reports';
import ChangePassword from './pages/ChangePassword';
import Profile from './pages/Profile';
import BookRequests from './pages/BookRequests';
import FineManagement from './pages/FineManagement';
import Settings from './pages/Settings';
import BookCategorization from './components/BookCategorization';
import BookIssueTracking from './components/BookIssueTracking';
import DigitalLibrary from './components/DigitalLibrary';
import DueDateAlerts from './components/DueDateAlerts';
import LibraryCardManagement from './components/LibraryCardManagement';
import BookLimitManagement from './components/BookLimitManagement';
import { useState, useEffect } from 'react';

function AppContent() {
  const [isAuth, setIsAuth] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsAuth(!!user);
  }, [location.pathname]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (isAuth === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}
      
      <Routes>
        <Route 
          path="/" 
          element={isAuth ? <Navigate to="/dashboard" replace /> : <Login setIsAuth={setIsAuth} />} 
        />
        <Route 
          path="/dashboard" 
          element={isAuth ? <DashboardLayout /> : <Navigate to="/" replace />}
        >
          <Route index element={<Dashboard />} />
          <Route path="books" element={<Books />} />
          <Route path="book-transactions" element={<BookTransactions />} />
          <Route path="members" element={<Members />} />
          <Route path="students" element={<Students />} />
          <Route path="reports" element={<Reports />} />
          <Route path="book-categorization" element={<BookCategorization />} />
          <Route path="book-issue" element={<BookIssueTracking />} />
          <Route path="digital-library" element={<DigitalLibrary />} />
          <Route path="due-alerts" element={<DueDateAlerts />} />
          <Route path="library-cards" element={<LibraryCardManagement />} />
          <Route path="book-limits" element={<BookLimitManagement />} />
          <Route path="book-requests" element={<BookRequests />} />
          <Route path="fine-management" element={<FineManagement />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;