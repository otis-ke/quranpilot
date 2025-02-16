import React from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/home'; 
import Login from './pages/login/login';
import Userdash from './pages/users/userdash';
import ProtectedRoute from './pages/users/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/Userdash" 
          element={
            <ProtectedRoute>
              <Userdash />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
