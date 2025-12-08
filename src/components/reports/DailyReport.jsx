import { Calendar, Clock, Download, Edit2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { branchesApi } from "../../api/branches";
import { reportsApi } from "../../api/reports";
import { exportToExcel } from "../../utils/exportUtils";
import { Loading } from "../common/Loading";
import { Modal } from "../common/Modal";
import { Pagination } from "../common/Pagination";

export const DailyReport = () => {
  const [reportData, setReportData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState([]);
  const [error, setError] = useState("");
  const [branch_id, setBranch_id] = useState("");
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [notesValue, setNotesValue] = useState("");
  const [updatingNotes, setUpdatingNotes] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    start_date: new Date().toISOString().slice(0, 10),
    end_date: new Date().toISOString().slice(0, 10),
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
      const response = await reportsApi.getDailyReport({
        ...filters,
        ...params,
      });
      if (response.success) {
        setReportData(response.data);
        setMeta(response.meta);
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch daily report"
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

  const handleEditNotes = (record) => {
    // Extract attendance ID from the record
    // We need to get the attendance ID - let's check if it's in the response
    setEditingAttendance(record);
    setNotesValue(record.notes || "");
    setIsNotesModalOpen(true);
  };

  const handleUpdateNotes = async () => {
    if (!editingAttendance) return;

    try {
      setUpdatingNotes(true);
      const response = await reportsApi.updateAttendanceNotes(
        editingAttendance.attendance_id,
        notesValue
      );
      
      if (response.success) {
        setIsNotesModalOpen(false);
        setEditingAttendance(null);
        setNotesValue("");
        // Refresh the report data
        fetchReport();
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update notes"
      );
    } finally {
      setUpdatingNotes(false);
    }
  };

  const handleExportPrint = () => {
    if (!reportData.length) {
      alert("No data available to print");
      return;
    }

    const columns = [
      { header: "Employee", key: "user_name" },
      { header: "Date", key: "date" },
      { header: "In Time", key: "in_time" },
      { header: "Out Time", key: "out_time" },
      { header: "Working Hours", key: "total_working_hour" },
      { header: "Status", key: "status" },
      { header: "Notes", key: "notes" },
      // { header: "Logs", key: "log" },
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
            if (col.key === "date" && value) {
              value = new Date(value).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
            }
            return `<td style="border:1px solid #ccc; padding:8px;">${
              value || "-"
            }</td>`;
          })
          .join("");
        return `<tr>${rowHtml}</tr>`;
      })
      .join("");

    const htmlContent = `
    <html>
      <head>
        <title>Daily Attendance Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            color: #333;
          }
          h1, h2 {
            text-align: center;
            margin: 0 0 10px 0;
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
          <h1 style="margin: 0;">Bonafide</h1>
        </div>
        <h2 style="text-align: center; margin: 0 0 10px 0;">Daily Attendance Report</h2>
        <div style="text-align: center; margin-bottom: 20px;">
          <span>Start Date: ${filters.start_date}</span>
          <span style="margin: 0 10px;">End Date: ${filters.end_date}</span>
          <span style="margin: 0 10px;">Branch: ${filters.branch_id ? branches.find(b => b.id === filters.branch_id)?.name : 'All Branches'}</span>
          <span>Name: ${filters.name ? filters.name : ''}</span>
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
      // Optional: Uncomment to auto-close after printing
      // printWindow.close();
    }, 500);
  };

  const handleExportExcel = () => {
    const columns = [
      { header: "Employee", key: "user_name" },
      { header: "Date", key: "date" },
      { header: "In Time", key: "in_time" },
      { header: "Out Time", key: "out_time" },
      { header: "Total Working Hours", key: "total_working_hour" },
      { header: "Status", key: "status" },
      { header: "Notes", key: "notes" },
      // { header: "Logs", key: "log" },
    ];
    exportToExcel(reportData, columns, "Daily Attendance Report");
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "present":
        return "bg-green-100 text-green-800";
      case "absent":
        return "bg-red-100 text-red-800";
      case "late":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
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
          <p className="text-gray-500 text-sm lg:text-base">
            Daily attendance tracking and time logs
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
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
                  Date
                </th>
                <th className="px-4 lg:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  In Time
                </th>
                <th className="px-4 lg:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Out Time
                </th>
                <th className="px-4 lg:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Working Hours
                </th>
                <th className="px-4 lg:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: '250px' }}>
                  Notes
                </th>
                {/* <th className="px-4 lg:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Logs
                </th> */}
              </tr>
            </thead>
            <tbody className={`bg-white divide-y divide-gray-200 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
              {reportData.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-2 lg:ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {record.user_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-gray-900">
                      {new Date(record.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                    {record.in_time || "-"}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                    {record.out_time || "-"}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900">
                    {record.total_working_hour || "-"}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadge(
                        record.status
                      )}`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-4 text-sm text-gray-900">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0" style={{ maxWidth: '400px' }}>
                        {record.notes ? (
                          <div className="group relative">
                            <p 
                              className="break-words text-gray-700 leading-relaxed"
                              style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxHeight: '3em',
                                lineHeight: '1.5em'
                              }}
                              title={record.notes}
                            >
                              {record.notes}
                            </p>
                            {record.notes.length > 100 && (
                              <div className="absolute left-0 top-full mt-2 hidden group-hover:block z-50 bg-gray-900 text-white text-xs rounded-lg px-4 py-3 max-w-lg break-words shadow-xl border border-gray-700">
                                <div className="whitespace-pre-wrap">{record.notes}</div>
                                <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 transform rotate-45 border-l border-t border-gray-700"></div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">No notes</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleEditNotes(record)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0 mt-0.5"
                        title="Edit Notes"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  {/* <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                    <small>{record.log || "-"}</small>
                  </td> */}
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

      {/* Notes Edit Modal */}
      <Modal
        isOpen={isNotesModalOpen}
        onClose={() => {
          setIsNotesModalOpen(false);
          setEditingAttendance(null);
          setNotesValue("");
        }}
        title="Edit Notes"
        size="md"
      >
        <div className="space-y-4">
          {editingAttendance && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Employee:</span> {editingAttendance.user_name}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Date:</span>{" "}
                {new Date(editingAttendance.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={notesValue}
              onChange={(e) => setNotesValue(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Enter notes..."
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleUpdateNotes}
              disabled={updatingNotes}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updatingNotes ? "Updating..." : "Update Notes"}
            </button>
            <button
              onClick={() => {
                setIsNotesModalOpen(false);
                setEditingAttendance(null);
                setNotesValue("");
              }}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
