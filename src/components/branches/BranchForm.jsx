import { useEffect, useState } from "react";
import { branchesApi } from "../../api/branches";
import { Loading } from "../common/Loading";

export const BranchForm = ({
  branch,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    opening_time: "",
    closing_time: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (branch) {
      setFormData({
        name: branch.name || "",
        address: branch.address || "",
        opening_time: branch.opening_time || "",
        closing_time: branch.closing_time || "",
      });
    }
  }, [branch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.name || !formData.address || !formData.opening_time || !formData.closing_time) {
      setError("Please fill in all required fields.");
      return false;
    }

    if (formData.address.length > 255) {
      setError("Address cannot exceed 255 characters.");
      return false;
    }

    const openingTime = new Date(`2000-01-01T${formData.opening_time}`);
    const closingTime = new Date(`2000-01-01T${formData.closing_time}`);

    if (closingTime <= openingTime) {
      setError("Closing time must be after opening time.");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      if (branch?.id) {
        await branchesApi.update(branch.id, formData);
      } else {
        await branchesApi.create(formData);
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving branch:", error);
      setError(
        error instanceof Error && error.message
          ? error.message
          : "Failed to save branch. Please try again."
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Branch Name <span className="text-red-500">*</span>
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
          Address <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          maxLength="255"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Opening Time <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            name="opening_time"
            value={formData.opening_time}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Closing Time <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            name="closing_time"
            value={formData.closing_time}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
        >
          {loading ? (
            <Loading size="sm" />
          ) : branch?.id ? (
            "Update Branch"
          ) : (
            "Add Branch"
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
