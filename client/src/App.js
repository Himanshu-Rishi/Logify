import React from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Username from './components/Username';
import Password from './components/Password';
import Reset from './components/Reset';
import Register from './components/Register';
import Recovery from './components/Recovery';
import Profile from './components/Profile';
import { AuthorizeUser, ProtectRoute } from './middleware/auth';
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Username />} />
        <Route
          exact
          path="/password"
          element={
            <ProtectRoute>
              <Password />
            </ProtectRoute>
          }
        />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/reset" element={<Reset />} />
        <Route exact path="/recovery" element={<Recovery />} />
        <Route
          exact
          path="/profile"
          element={
            <AuthorizeUser>
              <Profile />
            </AuthorizeUser>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App