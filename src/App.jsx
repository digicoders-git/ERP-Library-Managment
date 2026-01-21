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
import { Reports, Settings } from './pages/OtherPages';
import { useState, useEffect } from 'react';

function AppContent() {
  const [isAuth, setIsAuth] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsAuth(!!user);
  }, []);

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
          element={isAuth ? <Navigate to="/dashboard" replace /> : <Login />} 
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