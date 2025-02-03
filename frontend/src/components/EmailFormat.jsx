import { useState, useEffect } from "react";
import { Pencil, Trash2, X, Eye, Plus } from "lucide-react";

const EmailFormat = () => {
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [formats, setFormats] = useState([]);
  const [formData, setFormData] = useState("");
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFormats();
  }, [formData]);

  const fetchFormats = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No auth token found");
        setFormats([]);
        return;
      }
  
      const response = await fetch("http://localhost:8000/email/formats", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
      if (Array.isArray(data)) {
        setFormats(data);
      } else if (data) {
        setFormats([data]);
      } else {
        setFormats([]);
      }
    } catch (error) {
      console.error("Error fetching formats:", error);
      setFormats([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(
        `http://localhost:8000/email/${editId ? `update/${editId}` : 'create'}`,
        {
          method: editId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ formData }),
        }
      );

      if (response.ok) {
        alert(editId ? "✨ Format updated successfully!" : "🎉 Format created successfully!");
        fetchFormats();
      } else {
        alert("❌ Failed to save format.");
      }
      setShowForm(false);
      setFormData("");
      setEditId(null);
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  const handleEdit = (id, formatText) => {
    setFormData(formatText);
    setEditId(id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("🗑️ Are you sure you want to delete this format?")) return;
    
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:8000/email/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("✅ Format deleted successfully!");
        fetchFormats();
      } else {
        alert("❌ Failed to delete format.");
      }
    } catch (error) {
      console.error("Error deleting format:", error);
    }
  };

  const handlePreview = (format) => {
    setSelectedFormat(format);
    setShowPreview(true);
  };

  return (
    <div className="max-w-6xl mx-auto my-8 bg-white rounded-lg shadow-lg p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          ✉️ Email Formats
        </h1>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 ease-in-out"
          onClick={() => setShowForm(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Format ✨
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 transition-all duration-300">
        <div className="grid grid-cols-12 gap-4 bg-gray-50 p-4 text-sm font-medium text-gray-600">
          <div className="col-span-1">#️⃣</div>
          <div className="col-span-5">📝 Format</div>
          <div className="col-span-4">📅 Date</div>
          <div className="col-span-2">⚡ Actions</div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-2"></div>
              <p className="text-gray-500">Loading formats... ⌛</p>
            </div>
          ) : formats.length === 0 ? (
            <div className="p-8 text-center text-gray-500 animate-fade-in">
              <p>No formats available yet 📭</p>
              <p className="text-sm mt-2">Click "Add Format" to create one!</p>
            </div>
          ) : (
            formats.map((format, index) => (
              <div 
                key={format._id} 
                className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 items-center transform hover:scale-[1.01] transition-all duration-200 ease-in-out"
              >
                <div className="col-span-1 text-gray-600">{index + 1}</div>
                <div className="col-span-5 font-medium text-gray-800">{format.formData}</div>
                <div className="col-span-4 text-gray-600">
                  {new Date(format.updatedAt).toLocaleDateString()}
                </div>
                <div className="col-span-2 flex space-x-2">
                  <button
                    onClick={() => handlePreview(format)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110"
                    title="Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(format._id, format.formData)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200 hover:scale-110"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(format._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-all duration-200 hover:scale-110"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4 animate-scale-up">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                {editId ? "✏️ Edit Format" : "✨ Create Format"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors hover:rotate-90 transform duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    📝 Format
                  </label>
                  <textarea
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    value={formData}
                    onChange={(e) => setFormData(e.target.value)}
                    rows={4}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transform hover:scale-105 transition-all duration-200"
                >
                  {editId ? "✨ Update Format" : "🚀 Save Format"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && selectedFormat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4 animate-scale-up">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">👀 Format Preview</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors hover:rotate-90 transform duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-800 whitespace-pre-wrap">{selectedFormat.formData}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scale-up {
          from { 
            transform: scale(0.95);
            opacity: 0;
          }
          to { 
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-scale-up {
          animation: scale-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default EmailFormat;