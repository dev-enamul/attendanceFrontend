import Select from "react-select/async";
import { useEffect, useState } from "react";
import { employeesApi } from "../../api/employees";
import { designationsApi } from "../../api/designations";
import { Loading } from "../common/Loading";

export const EmployeeForm = ({
  employee,
  branches,
  onSuccess,
  onCancel,

}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    designation_id: "",
    branch_id: "",
    date_of_birth: "",
    gender: "",
    blood_group: "",
    marital_status: "",
    employee_id: "",
    weekly_holiday: "7", // Default to Friday
    office_start_time: "", // Required field
    office_end_time: "", // Required field
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState(null);

  const loadDesignationOptions = async (inputValue) => {
    const response = await designationsApi.getAll({ search: inputValue });
    return response.data.map((designation) => ({
      value: designation.id,
      label: designation.name,
    }));
  };

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || "",
        email: employee.email || "",
        phone: employee.phone || "",
        address: employee.address || "",
        designation_id:
          employee.designation?.id?.toString() ||
          employee.designation_id?.toString() ||
          "",
        branch_id:
          employee.branch?.id?.toString() || employee.branch_id?.toString() || "",
        date_of_birth: employee.date_of_birth || "",
        gender: employee.gender || "",
        blood_group: employee.blood_group || "",
        marital_status: employee.marital_status || "",
        employee_id: employee.employee_id || "",
        weekly_holiday: employee.weekly_holiday?.toString() || "7",
        office_start_time: employee.office_start_time || "",
        office_end_time: employee.office_end_time || "",
      });
      if (employee.designation) {
        setSelectedDesignation({
          value: employee.designation.id,
          label: employee.designation.name,
        });
      }
    } else {
      setSelectedDesignation(null);
    }
  }, [employee]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDesignationChange = (selectedOption) => {
    setFormData({
      ...formData,
      designation_id: selectedOption ? selectedOption.value : "",
    });
    setSelectedDesignation(selectedOption);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Client-side validation for required fields
    if (
      !formData.name ||
      !formData.email ||
      !formData.designation_id ||
      !formData.branch_id ||
      !formData.employee_id ||
      !formData.weekly_holiday ||
      !formData.office_start_time ||
      !formData.office_end_time
    ) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const submitData = {
        ...formData,
        designation_id: formData.designation_id
          ? parseInt(formData.designation_id, 10)
          : undefined,
        branch_id: formData.branch_id
          ? parseInt(formData.branch_id, 10)
          : undefined,
        weekly_holiday: formData.weekly_holiday
          ? parseInt(formData.weekly_holiday, 10)
          : undefined, // Convert to integer
      };

      // Remove empty strings and undefined
      Object.keys(submitData).forEach((key) => {
        if (submitData[key] === "" || submitData[key] === undefined) {
          delete submitData[key];
        }
      });

      if (employee?.id) {
        await employeesApi.update(employee.id, submitData);
      } else {
        await employeesApi.create(submitData);
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving employee:", error);
      setError(
        error instanceof Error && error.message
          ? error.message
          : "Failed to save employee. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Required Fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Branch <span className="text-red-500">*</span>
          </label>
          <select
            name="branch_id"
            value={formData.branch_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Branch</option>
            {Array.isArray(branches) &&
              branches.map((branch) => (
                <option key={branch?.id} value={branch?.id.toString()}>
                  {branch?.name}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Designation <span className="text-red-500">*</span>
          </label>
          <Select
            name="designation_id"
            value={selectedDesignation}
            onChange={handleDesignationChange}
            loadOptions={loadDesignationOptions}
            defaultOptions
            cacheOptions
            className="w-full"
            classNamePrefix="select"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Employee ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="employee_id"
            value={formData.employee_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Weekly Holiday <span className="text-red-500">*</span>
          </label>
          <select
            name="weekly_holiday"
            value={formData.weekly_holiday}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Holiday</option>
            <option value="6">Saturday</option>
            <option value="7">Sunday</option>
            <option value="1">Monday</option>
            <option value="2">Tuesday</option>
            <option value="3">Wednesday</option>
            <option value="4">Thursday</option>
            <option value="5">Friday</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Office Start Time <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            name="office_start_time"
            value={formData.office_start_time}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Office End Time <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            name="office_end_time"
            value={formData.office_end_time}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Optional Fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="others">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Blood Group
          </label>
          <select
            name="blood_group"
            value={formData.blood_group}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marital Status
          </label>
          <select
            name="marital_status"
            value={formData.marital_status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
        </div>
      </div>

      {/* Address - Full Width */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter full address"
        />
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
        >
          {loading ? (
            <Loading size="sm" />
          ) : employee?.id ? (
            "Update Employee"
          ) : (
            "Add Employee"
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

