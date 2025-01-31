
import { Pencil, Trash2, Eye, Plus } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  
  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Profile Management</h2>
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-600"
            onClick={() => navigate('/profile/create')}
          >
            <Plus size={16} />
            Create Profile
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Column</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Column</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Example row - you can map through your data here */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">1</td>
                <td className="px-6 py-4 whitespace-nowrap">Example Data</td>
                <td className="px-6 py-4 whitespace-nowrap">Example Data</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded">
                      <Eye size={16} />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded">
                      <Pencil size={16} />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Profile;