import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./services/AuthContext";
import Login from "./pages/Login";
import Home from "./pages/Home";
import TicketDetails from "./pages/TicketDetails";
import NotFound from "./pages/NotFound";
import "./App.css";
import Settings from "./pages/Settings";

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
            path="/ticket/:id"
            element={
              <PrivateRoute>
                <TicketDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element= {
              <PrivateRoute>
                <Settings />
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
