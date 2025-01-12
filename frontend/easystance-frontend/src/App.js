import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./services/AuthContext";
import Login from "./components/Login";
import Home from "./components/Home";
import NotFound from "./components/NotFound";

function PrivateRoute({ children }) {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return token ? children : <Navigate to="/login" />;
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
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="*"
            element={<NotFound />}
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
