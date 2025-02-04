import { useEffect, useState } from "react";
import { PencilIcon, TrashIcon, EyeIcon, X } from "lucide-react";

const HR = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedHr, setSelectedHr] = useState(null);
  const [hrList, setHRList] = useState([]);
  const [hrDetails, setHrDetails] = useState([]);
  const [formData, setFormData] = useState({
    companyName: '',
    hrName: '',
    hrEmail: '',
    phone: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      const response = await fetch("http://localhost:8000/hr/form", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      setHRList(Array.isArray(data) ? data : data ? [data] : []);
    } catch (error) {
      console.error("Error fetching formats:", error.message);
      setHRList([]);
    }
  };

  const fetchHrDetails = async (hrId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:8000/email/formats", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });


      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      await localStorage.setItem("hr_ID", hrId)
      const data = await response.json();
      console.log(data);
      setHrDetails(Array.isArray(data) ? data : [data]);
      setIsDetailsOpen(true);
    } catch (error) {
      console.error("Error fetching HR details:", error.message);
      setHrDetails([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('authToken');
      const url = formData._id
        ? `http://localhost:8000/hr/update/${formData._id}`
        : `http://localhost:8000/hr/create`;

      const response = await fetch(url, {
        method: formData._id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ formData }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      setIsOpen(false);
      fetchData();
      setFormData({
        companyName: '',
        hrName: '',
        hrEmail: '',
        phone: '',
      });
    } catch (e) {
      alert(`Error saving HR data: ${e.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this HR record?')) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:8000/hr/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      fetchData();
    } catch (e) {
      alert(`Error deleting HR data: ${e.message}`);
    }
  };

  const handleEdit = (hr) => {
    setFormData(hr);
    setIsOpen(true);
  };

  const handleSelect = (hr) => {
    setSelectedHr(hr);
    fetchHrDetails(hr._id);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleFormatAction = (details) => {
    console.log(details);
    localStorage.setItem("formData", details._id);
    // implement your action here
  }

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-800">HR Management</h2>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add HR
        </button>
      </div>

      <div className="p-6">
        <div className="rounded-lg border shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-4 text-left font-medium text-gray-600">Company</th>
                  <th className="px-6 py-4 text-left font-medium text-gray-600">HR Name</th>
                  <th className="px-6 py-4 text-left font-medium text-gray-600">Email</th>
                  <th className="px-6 py-4 text-left font-medium text-gray-600">Phone</th>
                  <th className="px-6 py-4 text-left font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {hrList.map((hr) => (
                  <tr key={hr._id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full">
                        {hr.companyName}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">{hr.hrName}</td>
                    <td className="px-6 py-4 text-blue-600">{hr.hrEmail}</td>
                    <td className="px-6 py-4">{hr.phone}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleSelect(hr)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(hr)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(hr._id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {hrList.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <p className="text-lg">No HR records found</p>
                        <p className="text-sm">Click Add HR to create a new record</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit HR Modal */}
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-xl font-semibold">
                  {formData._id ? 'Edit' : 'Add'} HR Details
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company Name</label>
                  <input
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">HR Name</label>
                  <input
                    name="hrName"
                    value={formData.hrName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <input
                    type="email"
                    name="hrEmail"
                    value={formData.hrEmail}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {formData._id ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* HR Details Modal */}
        {/* Previous code remains the same until the HR Details Modal section */}

        {/* Update only the HR Details Modal content */}
        {isDetailsOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-4xl mx-4 flex flex-col">

              {/* 🔹 Header (Sticky) */}
              <div className="flex items-center justify-between p-5 bg-gray-100 dark:bg-gray-800 border-b dark:border-gray-700 rounded-t-2xl">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Email Formats</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Viewing formats for <span className="font-medium">{selectedHr?.hrName}</span> from <span className="font-medium">{selectedHr?.companyName}</span>
                  </p>
                </div>
                <button
                  onClick={() => setIsDetailsOpen(false)}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* 🔹 Scrollable Table */}
              <div className="overflow-y-auto max-h-[70vh] p-5">
                <table className="min-w-full border-collapse">
                  {/* Table Header */}
                  <thead className="sticky top-0 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">#</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Email Format</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Created</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Updated</th>
                      <th className="px-4 py-3 text-center text-sm font-medium">Actions</th>
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody>
                    {hrDetails.map((detail, index) => (
                      <tr key={detail._id} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800">
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{index + 1}</td>
                        <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200 break-words">{detail.formData}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                          {new Date(detail.createdAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                          {new Date(detail.updatedAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleFormatAction(detail)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg shadow-md transition"
                          >
                            Select
                          </button>
                        </td>
                      </tr>
                    ))}

                    {/* Show message if no data available */}
                    {hrDetails.length === 0 && (
                      <tr>
                        <td colSpan="5" className="p-5 text-center text-gray-500 dark:text-gray-400">
                          No email formats available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HR;