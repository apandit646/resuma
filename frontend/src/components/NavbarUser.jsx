import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const NavbarUser = ({ setIsLoggedIn }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const firstName = localStorage.getItem("FristName");
  const lastName = localStorage.getItem("LastName");

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("UserId");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const navItems = [
    { icon: <UserPlus className="w-5 h-5" />, label: "Profile", link: "/profile" },
    { icon: <LogIn className="w-5 h-5" />, label: "LogOut", onClick: handleLogout },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-xl border-b border-gray-700"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between h-20"
        >
          {/* Logo/Brand */}
          <Link to="/">
            <motion.div 
              variants={itemVariants} 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.02 }}
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                <motion.span className="text-white text-3xl font-bold">
                  {firstName?.charAt(0) || ""}
                  {lastName?.charAt(0) || ""}
                </motion.span>
              </div>
              <motion.span className="text-gray-100 text-xl font-semibold hidden sm:inline-block">
                {firstName} {lastName}
              </motion.span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <motion.div variants={containerVariants} className="hidden md:block">
            <div className="flex items-center space-x-6">
              {navItems.map((item, index) => (
                <motion.button
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={item.onClick ? item.onClick : () => navigate(item.link)}
                  className="text-gray-300 bg-gray-800 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500
                    px-4 py-2 rounded-lg flex items-center space-x-2 
                    transition-all duration-300 ease-in-out shadow-lg hover:shadow-blue-500/20"
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleNavbar}
            className="md:hidden p-2 rounded-lg bg-gray-800 text-gray-300 hover:text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </motion.div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-gray-800 rounded-lg mt-2 overflow-hidden"
            >
              <div className="p-4 space-y-3">
                {navItems.map((item, index) => (
                  <motion.button
                    key={index}
                    variants={itemVariants}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={item.onClick ? item.onClick : () => navigate(item.link)}
                    className="text-gray-300 hover:text-white hover:bg-gray-700 
                      w-full px-4 py-3 rounded-lg text-left 
                      flex items-center space-x-3 transition-all duration-200"
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default NavbarUser;