import { Edit2, Mail, MapPin, Phone, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { branchesApi } from "../../api/branches";
import { designationsApi } from "../../api/designations";
import { employeesApi } from "../../api/employees";
import { Loading } from "../common/Loading";
import { Modal } from "../common/Modal";
import { Pagination } from "../common/Pagination";
import { EmployeeForm } from "./EmployeeForm";

export const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [meta, setMeta] = useState(null);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [branch_id, setBranch_id] = useState("");
  const [filters, setFilters] = useState({
    name: searchKeyword ?? "",
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    page: 1,
    per_page: 21,
    branch_id,
  });
  const fetchData = async () => {
    try {
      setLoading(true);
      const [branchesResponse] = await Promise.all([
        branchesApi.getAll("", 1000),
      ]);

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
  const fetchEmployees = async (params = {}) => {
    try {
      setLoading(true);
      const response = await employeesApi.getAll({ ...filters, ...params });
      if (response.success) {
        setEmployees(response?.data);
        setMeta(response?.meta);
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch employees"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [filters]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters((prev) => ({ ...prev, name: searchKeyword, page: 1 }));
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchKeyword]);

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleCreate = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await employeesApi.delete(id);
      setEmployees(employees.filter((e) => e.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete employee"
      );
    }
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
    fetchData();
  };

  if (loading && !employees.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading size="lg" text="Loading employees..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Employees</h2>
          <p className="text-gray-500">Manage your team members</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Search by name or id"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full"
        />
        <select
          value={branch_id}
          onChange={(e) => {
            const value = e.target.value;
            setBranch_id(value);
            setFilters((prev) => ({ ...prev, branch_id: value, page: 1 }));
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

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
        {employees?.map((employee) => (
          <div
            key={employee?.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {employee?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {employee?.name}
                  </h3>
                  <p className="text-sm text-blue-600">
                    {employee?.designation?.name}-{employee?.employee_id}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleEdit(employee)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirm(employee?.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{employee?.email}</span>
              </div>
              {employee?.phone && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{employee?.phone}</span>
                </div>
              )}
              {employee?.address && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{employee?.address}</span>
                </div>
              )}
            </div>

            {employee?.salary && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Salary</span>
                  <span className="font-semibold text-green-600">
                    ${employee?.salary.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <Pagination meta={meta} onPageChange={handlePageChange} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEmployee ? "Edit Employee" : "Add Employee"}
        size="lg"
      >
        <EmployeeForm
          employee={editingEmployee}
          branches={branches}
          onSuccess={handleFormSuccess}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {deleteConfirm && (
        <Modal
          isOpen={true}
          onClose={() => setDeleteConfirm(null)}
          title="Confirm Delete"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to delete this employee? This action cannot
              be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
