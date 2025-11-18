import { Calendar, Download, FileText, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { branchesApi } from "../../api/branches";
import { reportsApi } from "../../api/reports";
import { exportToExcel } from "../../utils/exportUtils";
import { Loading } from "../common/Loading";
import { Pagination } from "../common/Pagination";

export const MonthlyReport = () => {
  const [reportData, setReportData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [branches, setBranches] = useState([]);
  
  // Get default dates: 1st of current month to today
  const getDefaultStartDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0-based (0 = January, 11 = December)
    const firstDay = new Date(year, month, 1);
    
    // Format as YYYY-MM-DD
    const yearStr = firstDay.getFullYear();
    const monthStr = String(firstDay.getMonth() + 1).padStart(2, '0');
    const dayStr = String(firstDay.getDate()).padStart(2, '0');
    
    return `${yearStr}-${monthStr}-${dayStr}`;
  };

  const getDefaultEndDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  const [filters, setFilters] = useState({
    name: "",
    branch_id: "",
    start_date: getDefaultStartDate(),
    end_date: getDefaultEndDate(),
    page: 1,
    per_page: 20,
  });

  function formatHoursMinutes(decimalHours) {
    const totalMinutes = Math.round(decimalHours * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  }

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
      const response = await reportsApi.getMonthlyReport({
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
          : "Failed to fetch monthly report"
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

  const handleSearch = () => {
    fetchReport();
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleExportPrint = () => {
    if (!reportData.length) {
      alert("No data available to print");
      return;
    }

    const columns = [
      { header: "Employee", key: "user_name" },
      { header: "Total Days", key: "total_days_in_period" },
      { header: "Present Days", key: "present_days" },
      { header: "Absent Days", key: "absent_days" },
      { header: "Weekend Days", key: "week_off_days" },
      { header: "Holiday Days", key: "holiday_days" },
      { header: "Late Present Days", key: "late_present_days" },
      { header: "Late Present Hour", key: "total_late_present_hour" },
      { header: "Early Leave Days", key: "early_leave_days" },
      { header: "Half Office Days", key: "half_office_days" },
    ];

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Popup blocked. Please allow popups for this site.");
      return;
    }

    const headerRow = columns
      .map(
        (col) =>
          `<th style="border:1px solid #ccc; padding:8px; background:#f9f9f9;">${col.header}</th>`
      )
      .join("");

    const rows = reportData
      .map((row) => {
        const rowHtml = columns
          .map((col) => {
            let value = row[col.key];
            return `<td style="border:1px solid #ccc; padding:8px;">${ value || "-" }</td>`;
          })
          .join("");
        return `<tr>${rowHtml}</tr>`;
      })
      .join("");

    const htmlContent = `
    <html>
      <head>
        <title>Monthly Attendance Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            color: #333;
          }
          h1 {
            text-align: center;
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          th, td {
            font-size: 14px;
          }
          th {
            background-color: #f9f9f9;
          }
          tr:nth-child(even) {
            background-color: #fdfdfd;
          }
        </style>
      </head>
      <body>
        <div style="text-align: center; margin-bottom: 10px;">
          <img src="/bonafide_logo.jpeg" alt="Bonafide Logo" style="height: 40px; margin-bottom: 10px;">
    
        </div>
        <h2 style="text-align: center; margin: 0 0 10px 0;">Monthly Attendance Report</h2>
        <div style="text-align: center; margin-bottom: 20px;">
          <span>Start Date: ${filters.start_date}</span>
          <span style="margin: 0 10px;">End Date: ${filters.end_date}</span>
          <span style="margin: 0 10px;">Branch: ${filters.branch_id ? branches.find(b => b.id == filters.branch_id)?.name : 'All Branches'}</span>
        </div>
        <table>
          <thead>
            <tr>${headerRow}</tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
        <div style="margin-top: 80px; display: flex; justify-content: space-between;">
          <div style="text-align: center;">
            <p style="border-top: 1px solid #000; padding-top: 5px;">MD</p>
          </div>
          <div style="text-align: center;">
            <p style="border-top: 1px solid #000; padding-top: 5px;">GM</p>
          </div>
          <div style="text-align: center;">
            <p style="border-top: 1px solid #000; padding-top: 5px;">AGM</p>
          </div>
          <div style="text-align: center;">
            <p style="border-top: 1px solid #000; padding-top: 5px;">S&M</p>
          </div>
          <div style="text-align: center;">
            <p style="border-top: 1px solid #000; padding-top: 5px;">IT</p>
          </div>
        </div>
      </body>
    </html>
  `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const handleExportExcel = () => {
    const columns = [
      { header: "Employee", key: "user_name" },
      { header: "Total Days", key: "total_days_in_period" },
      { header: "Present Days", key: "present_days" },
      { header: "Absent Days", key: "absent_days" },
      { header: "Weekend Days", key: "week_off_days" },
      { header: "Holiday Days", key: "holiday_days" },
      { header: "Late Present Days", key: "late_present_days" },
      { header: "Late Present Hour", key: "total_late_present_hour" },
      { header: "Early Leave Days", key: "early_leave_days" },
      { header: "Half Office Days", key: "half_office_days" },
      { header: "Working Hours", key: "working_hours" },
      { header: "Expected Working Hours", key: "expected_working_hours" },
      { header: "Working Efficiency", key: "working_efficiency_percentage" },
    ];
    exportToExcel(reportData, columns, "Monthly Attendance Report");
  };

  if (loading && !reportData.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading size="lg" text="Loading monthly report..." />
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <FileText className="w-5 lg:w-6 h-5 lg:h-6 text-blue-600" />
            <span>Monthly Report</span>
          </h2>
          <p className="text-gray-500 text-sm lg:text-base">
            Comprehensive monthly attendance analysis
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
            onClick={handleExportPrint}
            className="bg-red-600 hover:bg-red-700 text-white px-3 lg:px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors text-sm lg:text-base"
          >
            Print
          </button>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                value={filters.start_date}
                onChange={(e) => handleFilterChange("start_date", e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={filters.end_date}
                onChange={(e) => handleFilterChange("end_date", e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
              />
            </div>
            <select
              value={filters.branch_id}
              onChange={(e) => handleFilterChange("branch_id", e.target.value)}
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
                <th className="px-4 lg:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Days
                </th>
                <th className="px-4 lg:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Present
                </th>
                <th className="px-4 lg:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Absent
                </th>
                <th className="px-4 lg:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Weekend Days
                </th>
                <th className="px-4 lg:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Holiday Days
                </th>
                <th className="px-4 lg:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Late Day
                </th>
                <th className="px-4 lg:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Late Hour
                </th>
                <th className="px-4 lg:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Early Leave
                </th>
                <th className="px-4 lg:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Half Office
                </th>
              </tr>
            </thead>
            <tbody className={`bg-white divide-y divide-gray-200 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
              {reportData.map((employee, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-2 lg:ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {employee.user_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                    {employee.total_days_in_period}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {employee.present_days}
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {employee.absent_days}
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                    {employee.week_off_days}
                  </td>

                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                    {employee.holiday_days}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      {employee.late_present_days}
                    </span>
                  </td> 
                   <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                     {employee.total_late_present_hour}
                    </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                    {employee.early_leave_days}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                    {employee.half_office_days}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {reportData.length === 0 && !loading && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No monthly report data available</p>
          </div>
        )}

        {meta && <Pagination meta={meta} onPageChange={handlePageChange} />}
      </div>
    </div>
  );
};
