import { Home, User, HelpCircle, LogOut, Mail } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SideNavbar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { title: 'Home', icon: Home, path: '/home' },
    { title: 'Profile', icon: User, path: '/profile' },
    { title: 'Create Profile', icon: User, path: '/profile/create' },
    { title: 'Email Format', icon: Mail, path: '/format_email' },
    { title: 'HR', icon: HelpCircle, path: '/hr' },
    { title: 'Help', icon: HelpCircle, path: '/help' },
    { title: 'Logout', icon: LogOut, path: '/logout' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth < 1024) setIsOpen(false);
  };

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div
        className={`h-full bg-black/50 backdrop-blur-lg text-white transition-all duration-300 ease-in-out ${
          isOpen ? 'w-64' : 'w-0'
        }`}
      >
        {/* Navigation Items */}
        <nav className="mt-8 space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center px-6 py-3 rounded-xl text-gray-200 hover:bg-gray-800 hover:text-white transition-all duration-300 shadow-md ${
                location.pathname === item.path ? 'bg-gray-800 text-white' : ''
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="ml-3 text-lg font-medium">{item.title}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SideNavbar;
