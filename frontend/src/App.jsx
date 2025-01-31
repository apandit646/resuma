import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

import Navbar from './components/Navbar';
import NavbarUser from './components/NavbarUser';
import Signup from './components/Signup';
import Login from './components/Login';
import Profile from './components/Profile';
import SideNavbar from './components/SideNev';
import HomeBase from './components/HomeBase';
import CreateProfile from './components/CreateProfile';
import EmailFormat from './components/EmailFormat';
import HR from './components/HR';


function App() {
  const token=localStorage.getItem('authToken')
  const [isLoggedIn, setIsLoggedIn] = useState(token?true:false);

  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen">
        {/* Navbar */}
        <div className="fixed top-0 left-0 right-0 z-50">
          {isLoggedIn ? (
            <NavbarUser setIsLoggedIn={setIsLoggedIn} />
          ) : (
            <Navbar setIsLoggedIn={setIsLoggedIn} />
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 pt-16">
          {/* Sidebar */}
          {isLoggedIn && (
            <div className="fixed top-16 left-0 h-full w-64 bg-gray-800 z-40">
              <SideNavbar/>
              
            </div>
          )}

          {/* Main Content */}
          <div
            className={`flex-1 overflow-auto p-4 ${
              isLoggedIn ? 'ml-64' : ''
            } transition-all duration-300`}
          >
            {console.log(isLoggedIn,'isLoggedIn')}
            <Routes>
              {/* Public Routes */}
              {!isLoggedIn ? (
                <>
                  <Route path="/" element={<Signup />} />
                  <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </> 
              ) : (
                <>
                  <Route path="/home" element={<HomeBase />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/profile/create" element={<CreateProfile/>} />
                  <Route path="/format_email" element={<EmailFormat/>} />
                  <Route path="/hr" element={<HR/>}  />
                  <Route path="*" element={<Navigate to="/home" />} />
                </>
              )}
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
