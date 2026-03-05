import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectRoute from "./routes/ProtectedRoute";
import ActivityLog from "./pages/ActivityLog"; 

import "./index.css";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Ruta Protegida: Dashboard dentro de ProtectRoute */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectRoute>
              <Dashboard />
            </ProtectRoute>
          } 
        />
        <Route 
          path="/actividad" 
          element={
            <ProtectRoute>
              <ActivityLog />
             </ProtectRoute>
           } 
/>

        {/* Redirecciones */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Cualquier ruta desconocida manda al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);