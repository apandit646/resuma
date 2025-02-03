import { useState } from "react";
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/outline"; // Import icons correctly

const HR = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hrList, setHRList] = useState([
    { id: 1, companyName: 'Tech Corp', hrName: 'John Doe', email: 'john@techcorp.com', phone: '123-456-7890' },
    { id: 2, companyName: 'Dev Inc', hrName: 'Jane Smith', email: 'jane@devinc.com', phone: '098-765-4321' },
  ]);
  const [formData, setFormData] = useState({
    companyName: '',
    hrName: '',
    hrEmail: '',
    phone: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken'); // Get the user's authentication token from localStorage
    try {
      // Implement your API call to save or update the HR data here
      const response = await fetch(`http://localhost:8000/hr/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({formData: formData}),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      alert("HR data saved successfully!");
      setFormData({
        companyName: '',
        hrName: '',
        hrEmail: '',
        phone: '',
      });

    }catch(e) {
      alert(`Error saving HR data: ${e.message}`);
    }
    
  };

  const handleDelete = (id) => {
    setHRList(hrList.filter(hr => hr.id !== id));
  };

  const handleEdit = (hr) => {
    setFormData(hr);
    setIsOpen(true);
  };

  const handleSelect = (id) => {
    console.log("Selected HR with id:", id);  // Implement your select logic here
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="p-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">HR Management</h1>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add HR
        </button>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">HR Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {hrList.map((hr) => (
              <tr key={hr.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{hr.companyName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{hr.hrName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{hr.hrEmail}</td>
                <td className="px-6 py-4 whitespace-nowrap">{hr.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap flex space-x-3">
                  <button
                    onClick={() => handleSelect(hr.id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleEdit(hr)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(hr.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
            {hrList.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No HR records found. Click "Add HR" to add new records.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">{formData.id ? 'Edit' : 'Add'} HR Details</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >

              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">Company Name</label>
                <input
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">HR Name</label>
                <input
                  name="hrName"
                  value={formData.hrName}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  name="hrEmail"
                  value={formData.hrEmail}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HR;
