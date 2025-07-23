import React, { useState, useEffect } from 'react';
import { Grid3X3, Download, Search, Filter } from 'lucide-react';
import { MonthlyAttendanceMatrix } from '../../types';
import { reportsApi } from '../../api/reports';
import { Loading } from '../common/Loading';

export const AttendanceMatrix: React.FC = () => {
  const [matrixData, setMatrixData] = useState<MonthlyAttendanceMatrix[]>([]);
  const [dates, setDates] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMatrix = async () => {
      try {
        setLoading(true);
        const response = await reportsApi.getMonthlyAttendanceMatrix();
        if (response.success) {
          setMatrixData(response.data.data);
          setDates(response.data.meta.dates || []);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch attendance matrix');
      } finally {
        setLoading(false);
      }
    };

    fetchMatrix();
  }, []);

  const filteredData = matrixData.filter(item =>
    item.employee_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case '✅':
        return { icon: '✅', color: 'bg-green-100 text-green-800', tooltip: 'Present' };
      case '❌':
        return { icon: '❌', color: 'bg-red-100 text-red-800', tooltip: 'Absent' };
      case '⛔':
        return { icon: '⛔', color: 'bg-gray-100 text-gray-800', tooltip: 'Holiday/Weekend' };
      case '🕐':
        return { icon: '🕐', color: 'bg-amber-100 text-amber-800', tooltip: 'Late' };
      default:
        return { icon: '-', color: 'bg-gray-100 text-gray-500', tooltip: 'No data' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading size="lg" text="Loading attendance matrix..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Grid3X3 className="w-6 h-6 text-blue-600" />
            <span>Monthly Attendance Matrix</span>
          </h2>
          <p className="text-gray-500">Visual representation of monthly attendance patterns</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <span className="flex items-center space-x-1">
                  <span className="w-4 h-4 bg-green-100 rounded flex items-center justify-center text-xs">✅</span>
                  <span>Present</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-4 h-4 bg-red-100 rounded flex items-center justify-center text-xs">❌</span>
                  <span>Absent</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-4 h-4 bg-gray-100 rounded flex items-center justify-center text-xs">⛔</span>
                  <span>Holiday</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                  Employee
                </th>
                {dates.map((date) => (
                  <th key={date} className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[40px]">
                    {date}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((employee, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap sticky left-0 bg-white z-10 border-r border-gray-200">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-xs">
                          {employee.employee_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-2">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                          {employee.employee_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  {dates.map((date) => {
                    const status = employee[date.toString()] || '-';
                    const statusInfo = getStatusIcon(status);
                    return (
                      <td key={date} className="px-2 py-3 text-center">
                        <div 
                          className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-medium ${statusInfo.color}`}
                          title={statusInfo.tooltip}
                        >
                          {statusInfo.icon}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && !loading && (
          <div className="text-center py-12">
            <Grid3X3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No attendance matrix data available</p>
          </div>
        )}
      </div>
    </div>
  );
};