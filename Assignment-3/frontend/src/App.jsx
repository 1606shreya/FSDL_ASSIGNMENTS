import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MedicalProfile from './pages/MedicalProfile';
import Dashboard from './pages/Dashboard';
import Compare from './pages/Compare';
import AdminPanel from './pages/AdminPanel';
import DashboardLayout from './components/DashboardLayout';
import NearbyPharmacies from './components/NearbyPharmacies';
import Profile from './pages/Profile';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="search" element={<Dashboard />} />
          <Route path="compare" element={<Compare />} />
          <Route path="pharmacies" element={<NearbyPharmacies />} />
          <Route path="saved" element={<div style={{ padding: '2rem' }}>Saved Medicines Page (Coming Soon)</div>} />
          <Route path="medical-profile" element={<MedicalProfile />} />
          <Route path="admin" element={<AdminPanel />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
