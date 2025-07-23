import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { Loading } from './components/common/Loading';
import { Dashboard } from './pages/Dashboard';
import { DesignationList } from './components/designations/DesignationList';
import { EmployeeList } from './components/employees/EmployeeList';
import { MonthlyReport } from './components/reports/MonthlyReport';
import { DailyReport } from './components/reports/DailyReport';
import { AbsenteeReport } from './components/reports/AbsenteeReport';
import { AttendanceMatrix } from './components/reports/AttendanceMatrix';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading size="lg" text="Loading application..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'employees':
        return <EmployeeList />;
      case 'designations':
        return <DesignationList />;
      case 'monthly-report':
        return <MonthlyReport />;
      case 'daily-report':
        return <DailyReport />;
      case 'absentee-report':
        return <AbsenteeReport />;
      case 'attendance-matrix':
        return <AttendanceMatrix />;
      case 'attendance':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Attendance Management</h2>
            <p className="text-gray-500">Coming soon! This feature will allow you to manage daily attendance.</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex h-[calc(100vh-80px)]">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;