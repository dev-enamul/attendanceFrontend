import {
  AlertTriangle,
  Calendar,
  Download,
  Filter,
  Search,
  UserX,
} from "lucide-react";
import { useEffect, useState } from "react";
import { branchesApi } from "../../api/branches";
import { reportsApi } from "../../api/reports";
import { exportToExcel, exportToPDF } from "../../utils/exportUtils";
import { Loading } from "../common/Loading";
import { Pagination } from "../common/Pagination";

export const AbsenteeReport = () => {
  const [reportData, setReportData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [branches, setBranches] = useState([]);
  const [branch_id, setBranch_id] = useState("");
  const [filters, setFilters] = useState({
    name: "",
    date: new Date().toISOString().split("T")[0],
    page: 1,
    per_page: 20,
    branch_id,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [branchesResponse] = await Promise.all([branchesApi.getAll()]);

      if (branchesResponse.success) {
        setBranches(branchesResponse?.data);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const fetchReport = async (params = {}) => {
    try {
      setLoading(true);
      const response = await reportsApi.getAbsenteeReport({
        ...filters,
        ...params,
      });
      if (response.success) {
        setReportData(response.data);
        setMeta(response.meta);
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch absentee report"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleExportPDF = () => {
    const columns = [
      { header: "Employee", key: "user_name" },
      // { header: "Continuous Absent Days", key: "continuous_absent_days" },
      { header: "This Week Absent", key: "this_week_absent" },
      { header: "This Month Absent", key: "this_month_absent" },
      { header: "This Year Absent", key: "this_year_absent" },
    ];
    exportToPDF(reportData, columns, "Absentee Report");
  };

  const handleExportExcel = () => {
    const columns = [
      { header: "Employee", key: "user_name" },
      // { header: "Continuous Absent Days", key: "continuous_absent_days" },
      { header: "This Week Absent", key: "this_week_absent" },
      { header: "This Month Absent", key: "this_month_absent" },
      { header: "This Year Absent", key: "this_year_absent" },
    ];
    exportToExcel(reportData, columns, "Absentee Report");
  };

  const getAlertLevel = (continuousAbsent) => {
    if (continuousAbsent >= 7) return "high";
    if (continuousAbsent >= 3) return "medium";
    return "low";
  };

  const getAlertColor = (level) => {
    switch (level) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-green-100 text-green-800 border-green-200";
    }
  };

  if (loading && !reportData.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading size="lg" text="Loading absentee report..." />
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <UserX className="w-5 lg:w-6 h-5 lg:h-6 text-red-600" />
            <span>Absentee Report</span>
          </h2>
          <p className="text-gray-500 text-sm lg:text-base">
            Track employee absence patterns and trends
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or id"
                value={filters.name}
                onChange={(e) => handleFilterChange("name", e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={filters.date}
                onChange={(e) =>
                  handleFilterChange("date", e.target.value)
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
              />
            </div>
            <select
              value={branch_id}
              onChange={(e) => {
                const value = e.target.value;
                setBranch_id(value);
                setFilters((prev) => ({ ...prev, branch_id: value }));
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full"
            >
              <option value="">All Branch</option>
              {Array.isArray(branches) &&
                branches.map((branch) => (
                  <option key={branch?.id} value={branch?.id}>
                    {branch?.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                {/* <th className="px-4 lg:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Continuous Absent
                </th> */}
                <th className="px-4 lg:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  This Week
                </th>
                <th className="px-4 lg:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  This Month
                </th>
                <th className="px-4 lg:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  This Year
                </th>
                {/* <th className="px-4 lg:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alert Level
                </th> */}
              </tr>
            </thead>
            <tbody className={`bg-white divide-y divide-gray-200 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
              {reportData.map((employee, index) => {
                const alertLevel = getAlertLevel(
                  employee.continuous_absent_days
                );
                return (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-6 lg:w-8 h-6 lg:h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-xs lg:text-sm">
                            {employee.user_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-2 lg:ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {employee.user_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          employee.continuous_absent_days > 0
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {employee.continuous_absent_days} days
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                      {employee.this_week_absent}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                      {employee.this_month_absent}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                      {employee.this_year_absent}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-center">
                      <div
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getAlertColor(
                          alertLevel
                        )}`}
                      >
                        {alertLevel === "high" && (
                          <AlertTriangle className="w-3 h-3 mr-1" />
                        )}
                        <span className="capitalize">{alertLevel}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {reportData.length === 0 && !loading && (
          <div className="text-center py-12">
            <UserX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No absentee report data available</p>
          </div>
        )}

        <Pagination meta={meta} onPageChange={handlePageChange} />
      </div>
    </div>
  );
};
