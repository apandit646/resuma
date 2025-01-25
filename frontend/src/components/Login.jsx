import  { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { email, password };
    setIsLoggedIn(false); // Reset the login status to false before making the API call

    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);     
      }
      const result=await response.json();
      localStorage.setItem('authToken', result.token)
      localStorage.setItem('FristName', result.firstName)
      localStorage.setItem('LastName', result.lastName)
      localStorage.setItem('UserId', result.id)
      setIsLoggedIn(true);
      navigate("/profile");
    } catch (error) {
      setIsLoggedIn(false);
      alert(`❌ Login Failed: ${error.message}`);
      
    }

  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 to-sky-100 flex items-center justify-center p-4"
    >
      <motion.div
        className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-8 border-4 border-sky-300"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <h1 className="text-4xl font-bold text-center text-sky-600 mb-8 tracking-wide">
          Login
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <label className="block text-sky-700 font-medium mb-2">Email</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-sky-50 border-2 border-sky-300 rounded-xl text-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <label className="block text-sky-700 font-medium mb-2">Password</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-sky-50 border-2 border-sky-300 rounded-xl text-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </motion.div>
          
          <motion.button 
            type="submit" 
            className="w-full bg-sky-600 text-white py-4 rounded-xl text-lg font-bold hover:bg-sky-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign In
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Login;