import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./components/context/AuthContext";
import LandingPage from "./components/LandingPage";
import SignUp from "./components/user-auth/SignUp";
import LogIn from "./components/user-auth/LogIn";
import RoleSelection from "./components/Role-Selection";
import CreateInstitution from "./components/admin/CreateInstitution";
import AdminDashboard from "./components/admin/AdminDashboard";
import { InstitutionProvider } from "./components/context/InstitutionContext";

export default function App() {
  return (
    <AuthProvider>
      <InstitutionProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          
          {/* Admin Routes */}
          <Route path="/admin/create-institution" element={<CreateInstitution />} />
          <Route path="/admin/dashboard" element={<AdminDashboard /> } />
        </Routes>
      </InstitutionProvider>
    </AuthProvider>
  );
}
