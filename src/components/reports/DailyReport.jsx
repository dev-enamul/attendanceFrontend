import React, { useState, useEffect } from 'react';
import { Clock, Download, Search, Calendar } from 'lucide-react';
import { reportsApi } from '../../api/reports';
import { Loading } from '../common/Loading';
import { Pagination } from '../common/Pagination';
import { exportToPDF, exportToExcel } from '../../utils/exportUtils';

export const DailyReport = () => {
  const [reportData, setReportData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    page: 1,
    per_page: 20
  });

  const fetchReport = async (params = {}) => {
    try {
      setLoading(true);
      const response = await reportsApi.getDailyReport({ ...filters, ...params });
      if (response.success) {
        setReportData(response.data);
        setMeta(response.meta);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch daily report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleExportPDF = () => {
    const columns = [
      { header: 'Employee', key: 'user_name' },
      { header: 'Date', key: 'date' },
      { header: 'In Time', key: 'in_time' },
      { header: 'Out Time', key: 'out_time' },
      { header: 'Working Hours', key: 'total_working_hour' },
      { header: 'Status', key: 'status' },
      { header: 'Logs', key: 'log' }
    ];
    exportToPDF(reportData, columns, 'Daily Attendance Report');
  };

  const handleExportExcel = () => {
    const columns = [
      { header: 'Employee', key: 'user_name' },
      { header: 'Date', key: 'date' },
      { header: 'In Time', key: 'in_time' },
      { header: 'Out Time', key: 'out_time' },
      { header: 'Total Working Hours', key: 'total_working_hour' },
      { header: 'Status', key: 'status' },
      { header: 'Logs', key: 'log' }
    ];
    exportToExcel(reportData, columns, 'Daily Attendance Report');
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'late':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && !reportData.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading size="lg" text="Loading daily report..." />
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Clock className="w-5 lg:w-6 h-5 lg:h-6 text-blue-600" />
            <span>Daily Report</span>
          </h2>
          <p className="text-gray-500 text-sm lg:text-base">Daily attendance tracking and time logs</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          {/* <button 
            onClick={handleExportPDF}
            className="bg-red-600 hover:bg-red-700 text-white px-3 lg:px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors text-sm lg:text-base"
          >
            <Download className="w-4 h-4" />
            <span>PDF</span>
          </button> */}
          <button 
            onClick={handleExportExcel}
            className="bg-green-600 hover:bg-green-700 text-white px-3 lg:px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors text-sm lg:text-base"
          >
            <Download className="w-4 h-4" />
            <span>Excel</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm lg:text-base">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 lg:p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name..."
                value={filters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
              />
            </div>
            
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-4 lg:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 lg:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">In Time</th>
                <th className="px-4 lg:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Out Time</th>
                <th className="px-4 lg:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Working Hours</th>
                <th className="px-4 lg:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 lg:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Logs</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportData.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      
                      <div className="ml-2 lg:ml-3">
                        <div className="text-sm font-medium text-gray-900">{record.user_name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-gray-900">
                      {new Date(record.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                    {record.in_time || '-'}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                    {record.out_time || '-'}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900">
                    {record.total_working_hour || '-'}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadge(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                    <small>{record.log || '-'}</small>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {reportData.length === 0 && !loading && (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No daily report data available</p>
          </div>
        )}

        <Pagination meta={meta} onPageChange={handlePageChange} />
      </div>
    </div>
  );
};