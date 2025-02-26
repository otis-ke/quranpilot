import React from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/home';
import Adminlogin from './admin/adminlogin';
import Dashboard from './admin/dashboard';
import Login from './pages/login/login';
import Userdash from './pages/users/userdash';
import ProtectedRoute from './pages/users/ProtectedRoute';
import Messages from "./admin/pages/messages";
import Notifications from "./admin/pages/notification";
import Payments from "./admin/pages/payments";
import Students from "./admin/pages/students";
import Overview from "./admin/pages/overview";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/adminlogin" element={<Adminlogin />} />

        {/* Protected User Dashboard */}
        <Route 
          path="/Userdash" 
          element={
            <ProtectedRoute>
              <Userdash />
            </ProtectedRoute>
          } 
        />

        {/* Protected Admin Dashboard with Nested Routes */}
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route path="overview" element={<Overview />} />
          <Route path="messages" element={<Messages />} />
          <Route path="payments" element={<Payments />} />
          <Route path="students" element={<Students />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>

        {/* Redirect unknown routes to Home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
