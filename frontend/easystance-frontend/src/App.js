import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/AuthContext";
import Login from "./components/Login";
import Home from "./components/Home";

//import './App.css';

function PrivateRoute({ children }) {
  const { authUser } = useAuth();
  return authUser ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="*"
            element={<Navigate to="/login" />}
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
