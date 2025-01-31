import { useState } from 'react';
import { Pencil, Trash2, X, Eye } from 'lucide-react';

const EmailFormat = () => {
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [formats, setFormats] = useState([]);
  const [formData, setFormData] = useState({
    format: '',
    date: ''
  });
  const [editIndex, setEditIndex] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      // Update existing format
      const updatedFormats = [...formats];
      updatedFormats[editIndex] = { ...formData };
      setFormats(updatedFormats);
      setEditIndex(null);
    } else {
      // Add new format
      setFormats([...formats, formData]);
    }
    setFormData({ format: '', date: '' });
    setShowForm(false);
  };

  const handleEdit = (index) => {
    setFormData(formats[index]);
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    const updatedFormats = formats.filter((_, i) => i !== index);
    setFormats(updatedFormats);
  };

  const handlePreview = (format) => {
    setSelectedFormat(format);
    setShowPreview(true);
  };

  return (
    <div className="p-4">
      <button
        type="button"
        className="px-4 py-2 mb-4 text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
        onClick={() => setShowForm(true)}
      >
        Create Format
      </button>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create Format</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2">Format:</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={formData.format}
                  onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {editIndex !== null ? 'Update Format' : 'Save Format'}
              </button>
            </form>
          </div>
        </div>
      )}

      {showPreview && selectedFormat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Format Preview</h2>
              <button onClick={() => setShowPreview(false)} className="text-gray-500">
                <X size={24} />
              </button>
            </div>
            <div className="border rounded p-4">
              <div className="mb-2">
                <span className="font-semibold">Format:</span> {selectedFormat.format}
              </div>
              <div>
                <span className="font-semibold">Date:</span> {selectedFormat.date}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4">
        <div className="grid grid-cols-5 gap-4 bg-gray-100 p-3 font-semibold">
          <div>S.NO</div>
          <div>Format</div>
          <div>Date</div>
          <div className="col-span-2">Actions</div>
        </div>
        {formats.map((format, index) => (
          <div key={index} className="grid grid-cols-5 gap-4 border-b p-3">
            <div>{index + 1}</div>
            <div>{format.format}</div>
            <div>{format.date}</div>
            <div className="col-span-2 flex gap-2">
              <button
                onClick={() => handlePreview(format)}
                className="p-1 text-green-600 hover:bg-green-50 rounded"
                title="Preview"
              >
                <Eye size={20} />
              </button>
              <button
                onClick={() => handleEdit(index)}
                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                title="Edit"
              >
                <Pencil size={20} />
              </button>
              <button
                onClick={() => handleDelete(index)}
                className="p-1 text-red-600 hover:bg-red-50 rounded"
                title="Delete"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmailFormat;