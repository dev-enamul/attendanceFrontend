import { Download, Grid3X3, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { reportsApi } from "../../api/reports";
import { exportMatrixToExcel, exportMatrixToPDF } from "../../utils/exportUtils";
import { Loading } from "../common/Loading";
import { Pagination } from "../common/Pagination";

export const AttendanceMatrix = () => {
  const [matrixData, setMatrixData] = useState([]);
  const [dates, setDates] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    name: "",
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    page: 1,
    per_page: 20,
  });

  const fetchMatrix = async (params = {}) => {
    try {
      setLoading(true);
      const response = await reportsApi.getMonthlyAttendanceMatrix({
        ...filters,
        ...params,
      });
      if (response.success) {
        setMatrixData(response.data);
        setDates(response.meta.dates || []);
        setMeta(response.meta);
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch attendance matrix"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatrix();
  }, [filters.page, filters.per_page, filters.name, filters.year, filters.month]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleExportPDF = () => {
    exportMatrixToPDF(matrixData, dates, "Monthly Attendance Matrix");
  };

  const handleExportExcel = () => {
    exportMatrixToExcel(matrixData, dates, "Monthly Attendance Matrix");
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "✅":
        return {
          icon: "✅",
          color: "bg-green-100 text-green-800",
          tooltip: "Present",
        };
      case "❌":
        return {
          icon: "❌",
          color: "bg-red-100 text-red-800",
          tooltip: "Absent",
        };
      case "⛔":
        return {
          icon: "⛔",
          color: "bg-gray-100 text-gray-800",
          tooltip: "Holiday/Weekend",
        };
      case "🏖️":
        return {
          icon: "🏖️",
          color: "bg-blue-100 text-blue-800",
          tooltip: "Leave",
        };
      case "🕐":
        return {
          icon: "🕐",
          color: "bg-amber-100 text-amber-800",
          tooltip: "Late",
        };
      default:
        return {
          icon: "-",
          color: "bg-gray-100 text-gray-500",
          tooltip: "No data",
        };
    }
  };

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  if (loading && !matrixData.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading size="lg" text="Loading attendance matrix..." />
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Grid3X3 className="w-5 lg:w-6 h-5 lg:h-6 text-blue-600" />
            <span>Monthly Attendance Matrix</span>
          </h2>
          <p className="text-gray-500 text-sm lg:text-base">
            Visual representation of monthly attendance patterns
          </p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name..."
                value={filters.name}
                onChange={(e) => handleFilterChange("name", e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
              />
            </div>
            <select
              value={filters.year}
              onChange={(e) => handleFilterChange("year", parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <select
              value={filters.month}
              onChange={(e) => handleFilterChange("month", parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 lg:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                  Employee
                </th>
                {dates.map((date) => (
                  <th
                    key={date}
                    className="px-1 lg:px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[32px] lg:min-w-[40px]"
                  >
                    {date}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {matrixData.map((employee, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 lg:px-4 py-3 whitespace-nowrap sticky left-0 bg-white z-10 border-r border-gray-200">
                    <div className="flex items-center">
                      <div className="w-5 lg:w-6 h-5 lg:h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-xs">
                          {employee.employee_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-2">
                        <div className="text-xs lg:text-sm font-medium text-gray-900 truncate max-w-[100px] lg:max-w-[120px]">
                          {employee.employee_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  {dates.map((date) => {
                    const status = employee[date.toString()] || "-";
                    const statusInfo = getStatusIcon(status);
                    return (
                      <td key={date} className="px-1 lg:px-2 py-3 text-center">
                        <div
                          className={`inline-flex items-center justify-center w-5 lg:w-6 h-5 lg:h-6 rounded text-xs font-medium ${statusInfo.color}`}
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

        {matrixData.length === 0 && !loading && (
          <div className="text-center py-12">
            <Grid3X3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No attendance matrix data available</p>
          </div>
        )}

        {meta && <Pagination meta={meta} onPageChange={handlePageChange} />}
      </div>
    </div>
  );
};