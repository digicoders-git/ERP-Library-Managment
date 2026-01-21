import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Dashboard from '../pages/Dashboard';
import Books from '../pages/Books';
import BookTransactions from '../pages/BookTransactions';
import Members from '../pages/Members';
import Students from '../pages/Students';
import { Reports, Settings } from '../pages/OtherPages';

const DashboardLayout = () => {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeItem) {
      case 'dashboard':
        return <Dashboard />;
      case 'books':
        return <Books />;
      case 'book-transactions':
        return <BookTransactions />;
      case 'members':
        return <Members />;
      case 'students':
        return <Students />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <Navbar isCollapsed={isCollapsed} />
      <main className="overflow-y-auto" style={{marginLeft: isCollapsed ? '64px' : '256px', marginTop: '80px', minHeight: 'calc(100vh - 80px)'}}>
        {renderContent()}
      </main>
    </div>
  );
};

export default DashboardLayout;