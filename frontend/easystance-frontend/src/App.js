import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./services/AuthContext";
import { t } from "./translations/translations";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CreateTicket from "./pages/CreateTicket";
import TicketDetails from "./pages/TicketDetails";
import ErrorPage from "./pages/ErrorPage";
import "./App.css";

function PrivateRoute({ roles, children }) {
  const { token, role, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/login" />;
  }

  return roles.includes(role) ? children : <Navigate to="/unauthorized" />;
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
            path="/tickets"
            element={
              <PrivateRoute roles={["administrator", "operator", "technician", "customer"]}>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/tickets/create"
            element={
              <PrivateRoute roles={["administrator", "operator"]}>
                <CreateTicket />
              </PrivateRoute>
            }
          />
          <Route
            path="/tickets/:id"
            element={
              <PrivateRoute roles={["administrator", "operator", "technician", "customer"]}>
                <TicketDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/unauthorized"
            element={
              <PrivateRoute roles={["administrator", "operator", "technician", "customer"]}>
                <ErrorPage error={t(`error_unauthorized`)} />
              </PrivateRoute>
            }
          />
          <Route
            path="/"
            element={
              <PrivateRoute roles={["administrator", "operator", "technician", "customer"]}>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="*"
            element={
              <PrivateRoute roles={["administrator", "operator", "technician", "customer"]}>
                <ErrorPage error={t(`error_page_not_found`)}/>
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
