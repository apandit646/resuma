import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

import Navbar from './components/Navbar';
import NavbarUser from './components/NavbarUser';
import Signup from './components/Signup';
import Login from './components/Login';
import Profile from './components/Profile';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      {isLoggedIn ? <NavbarUser setIsLoggedIn={setIsLoggedIn}  /> : <Navbar setIsLoggedIn={setIsLoggedIn} />}
      <Routes>
        {!isLoggedIn ? (
          <>
            <Route path="/" element={<Signup />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} /> 
          </>
        ) : (
          <>
          <Route path="/profile" element={<Profile />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}
export default App;
