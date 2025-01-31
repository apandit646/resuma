import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload } from 'lucide-react';

const UserForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    programmingLanguages: '',
    technologies: '',
    skills: '',
    experience: '',
    resume: null,
  });
  const [fileError, setFileError] = useState('');
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateFile = (file) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      setFileError('Please upload only PDF or DOC/DOCX files');
      return false;
    }

    if (file.size > maxSize) {
      setFileError('File size must be less than 10MB');
      return false;
    }

    setFileError('');
    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (validateFile(file)) {
        setFormData({ ...formData, resume: file });
        setFileName(file.name);
      } else {
        e.target.value = '';
        setFormData({ ...formData, resume: null });
        setFileName('');
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (validateFile(file)) {
        setFormData({ ...formData, resume: file });
        setFileName(file.name);
      }
    }
  };

  const formFields = [
    { name: 'firstName', label: '👤 First Name', type: 'text' },
    { name: 'lastName', label: '👤 Last Name', type: 'text' },
    { name: 'email', label: '📧 Email', type: 'email' },
    { name: 'phoneNumber', label: '📱 Phone Number', type: 'tel' },
    { name: 'address', label: '🏠 Address', type: 'text' },
    { name: 'city', label: '🌆 City', type: 'text' },
    { name: 'state', label: '🗺️ State', type: 'text' },
    { name: 'zip', label: '📍 Zip Code', type: 'text' },
    { name: 'programmingLanguages', label: '💻 Programming Languages', type: 'text' },
    { name: 'technologies', label: '⚡ Technologies', type: 'text' },
    { name: 'skills', label: '🎯 Skills', type: 'text' },
    { name: 'experience', label: '⭐ Experience', type: 'text' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');

    try {
      const formDataToSend = new FormData();
      
      // Append all text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'resume') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Append resume file if exists
      if (formData.resume) {
        formDataToSend.append('resume', formData.resume);
      }

      const response = await fetch("http://localhost:8000/profile/create", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      await response.json();
      alert("🎉 User Profile Created! 🎉");
      navigate("/profile");
      
    } catch (error) {
      alert(`❌ Profile creation failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
            🚀 User Profile Form 🚀
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formFields.map((field) => (
                <div key={field.name} className="relative">
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    id={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                             transition duration-150 ease-in-out"
                  />
                </div>
              ))}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                📄 Resume
              </label>
              <div 
                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 
                  ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} 
                  ${fileError ? 'border-red-500' : ''}
                  border-dashed rounded-md transition-colors duration-200`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="space-y-1 text-center">
                  {!fileName ? (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="resume"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                        >
                          <span>Upload a file</span>
                          <input
                            id="resume"
                            name="resume"
                            type="file"
                            className="sr-only"
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PDF, DOC up to 10MB</p>
                    </>
                  ) : (
                    <div className="flex flex-col items-center">
                      <p className="text-sm text-gray-600">{fileName}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, resume: null });
                          setFileName('');
                          setFileError('');
                        }}
                        className="mt-2 text-sm text-red-600 hover:text-red-500"
                      >
                        Remove file
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {fileError && (
                <p className="mt-2 text-sm text-red-600">{fileError}</p>
              )}
            </div>

            <div className="flex justify-center mt-8">
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-md
                         hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                         focus:ring-blue-500 transform transition hover:scale-105"
              >
                🚀 Submit Application 🎉
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserForm;