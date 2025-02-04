import { Pencil, Trash2, Eye, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No auth token found");
        setProfiles([]);
        return;
      }

      const response = await fetch("http://localhost:8000/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (Array.isArray(data)) {
        setProfiles(data);
      } else if (data && data.profile) {
        setProfiles([data.profile]);
      } else {
        setProfiles([]);
      }
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };

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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resume</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {profiles.map((profile, index) => (
                <tr key={profile.id || index} className="hover:bg-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{profile.fullname}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{profile.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{profile.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{profile.resume}</td>
                  <td className={`px-6 py-4 whitespace-nowrap ${profile.updatedAt}`}>
                    {profile.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-200 rounded">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 hover:bg-gray-200 rounded">
                        <Pencil size={16} />
                      </button>
                      <button className="p-2 hover:bg-red-100 text-red-600 rounded">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {profiles.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">
                    No profiles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Profile;
