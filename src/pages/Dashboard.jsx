import React, { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, Clock, TrendingUp, Calendar, AlertTriangle } from 'lucide-react';
import { dashboardApi } from '../api/dashboard';
import { Loading } from '../components/common/Loading';

export const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [attendanceTrend, setAttendanceTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [summaryResponse, trendResponse] = await Promise.all([
          dashboardApi.getSummary(),
          dashboardApi.getAttendanceTrend(),
        ]);

        if (summaryResponse.success) {
          setSummary(summaryResponse.data);
        }
        if (trendResponse.success) {
          setAttendanceTrend(trendResponse.data);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <p className="text-red-600 font-medium">Error loading dashboard</p>
        </div>
        <p className="text-red-500 text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No dashboard data available</p>
      </div>
    );
  }

  const todayStats = [
    {
      title: 'Present',
      value: summary.today.present,
      icon: UserCheck,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      title: 'Absent',
      value: summary.today.absent,
      icon: UserX,

      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
    },
    {
      title: 'Off Day',
      value: summary.today.off_day,
      icon: Calendar,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      title: 'Late',
      value: summary.today.late,
      icon: Clock,
      color: 'bg-amber-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
    }, 
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome to Attendance Management</h1>
            <p className="text-blue-100 text-lg">
              Today is {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{summary.total_employees}</div>
            <div className="text-blue-100">Total Employees</div>
          </div>
        </div>
      </div>

      {/* Today's Stats */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {todayStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className={`${stat.bgColor} rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className={`text-2xl font-bold ${stat.textColor} mt-1`}>
                      {stat.value.toLocaleString()}
                    </p>
                  </div>
                  <div className={`${stat.color} rounded-lg p-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly & Yearly Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">This Month</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Present</span>
              <span className="font-semibold text-green-600">{summary.this_month.present}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Absent</span>
              <span className="font-semibold text-red-600">{summary.this_month.absent}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Off Day</span>
              <span className="font-semibold text-blue-600">{summary.this_month.off_day}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Late</span>
              <span className="font-semibold text-amber-600">{summary.this_month.late}</span>
            </div> 
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">This Year</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Present</span>
              <span className="font-semibold text-green-600">{summary.this_year.present}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Absent</span>
              <span className="font-semibold text-red-600">{summary.this_year.absent}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Off Day</span>
              <span className="font-semibold text-blue-600">{summary.this_year.off_day}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Late</span>
              <span className="font-semibold text-amber-600">{summary.this_year.late}</span>
            </div>
            
          </div>
        </div>
      </div>

      {/* Attendance Trend */}
      {attendanceTrend.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Attendance Trend</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 font-medium text-gray-600">Date</th>
                  <th className="text-center py-2 font-medium text-gray-600">Present</th>
                  <th className="text-center py-2 font-medium text-gray-600">Absent</th>
                  <th className="text-center py-2 font-medium text-gray-600">Late</th>
                </tr>
              </thead>
              <tbody>
                {attendanceTrend.slice(-7).map((trend, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-2">
                      {new Date(trend.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </td>
                    <td className="text-center py-2 text-green-600 font-medium">{trend.present}</td>
                    <td className="text-center py-2 text-red-600 font-medium">{trend.absent}</td>
                    <td className="text-center py-2 text-amber-600 font-medium">{trend.late}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )} 
    </div>
  );
};