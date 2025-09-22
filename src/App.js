import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Component imports
import Homepage from "./component/homepage.js";
import GradingPage from "./component/GradingPage.js";
import Login from "./component/login.js";
import Student from "./component/Student.js";
import Teacher from "./component/Teacher.js";
import RoleSelector from "./component/RoleSelector.js";
import AssignmentPage from "./component/AssignmentPage.js";
import ProtectedRoute from "./component/ProtectedRoute.js";

/**
 * Main App Component
 * Handles routing for the educational platform
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/grading" element={<GradingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/role-selector" element={<RoleSelector />} />
        
        {/* Protected routes - Student */}
        <Route path="/student-dashboard" element={
          <ProtectedRoute requiredRole="student">
            <Student />
          </ProtectedRoute>
        } />
        <Route path="/assignment/:assignmentId" element={
          <ProtectedRoute requiredRole="student">
            <AssignmentPage />
          </ProtectedRoute>
        } />
        
        {/* Protected routes - Teacher */}
        <Route path="/teacher-dashboard" element={
          <ProtectedRoute requiredRole="teacher">
            <Teacher />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;