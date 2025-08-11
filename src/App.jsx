import { useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { LoginForm } from "./components/auth/LoginForm";
import { Header } from "./components/common/Header";
import { Loading } from "./components/common/Loading";
import { Sidebar } from "./components/common/Sidebar";
import { DesignationList } from "./components/designations/DesignationList";
import { EmployeeList } from "./components/employees/EmployeeList";
import { AbsenteeReport } from "./components/reports/AbsenteeReport";
import { AttendanceMatrix } from "./components/reports/AttendanceMatrix";
import { DailyReport } from "./components/reports/DailyReport";
import { MonthlyReport } from "./components/reports/MonthlyReport";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Dashboard } from "./pages/Dashboard";
import Branches from "./pages/Branches";

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex h-[calc(100vh-80px)]">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employee" element={<EmployeeList />} />
            <Route path="/designation" element={<DesignationList />} />
            <Route path="/branches" element={<Branches />} />
            <Route path="/monthly-report" element={<MonthlyReport />} />
            <Route path="/daily-report" element={<DailyReport />} />
            <Route path="/absentee-report" element={<AbsenteeReport />} />
            <Route path="/attendance-matrix" element={<AttendanceMatrix />} />
            <Route
              path="/attendance"
              element={
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Attendance Management
                  </h2>
                  <p className="text-gray-500">
                    Coming soon! This feature will allow you to manage daily
                    attendance.
                  </p>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
