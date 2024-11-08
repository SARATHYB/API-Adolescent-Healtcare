import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import UpdateHealthData from './components/UpdateHealthData';
import CheckSymptoms from './components/CheckSymptoms';
import MentalHealthResources from './components/MentalHealthResources';
import NutritionPlan from './components/NutritionPlan';
import FitnessTracker from './components/FitnessTracker';
import BookAppointment from './components/BookAppointment';
import AccessRequest from './components/AccessRequest';
import AppointmentReminders from './components/AppointmentReminders';
import ReproductiveHealthArticles from './components/ReproductiveHealthArticles';
import MenstrualTracker from './components/MenstrualTracker';
import './App.css';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token')); // Check local storage for token

  useEffect(() => {
    if (!token) {
      localStorage.removeItem('token'); // Clear invalid token
    }
  }, [token]);

  return (
    <Router>
      <div className="app-container">
        <header className="header-ribbon">
          <h1>LifeLink</h1>
          <h4>An Adolescent Healthcare API by SARATHY B</h4>
        </header>
        <Routes>
          <Route path="/" element={
            <div className="login-container">
              <Login setToken={setToken} token={token} />
            </div>
          } />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={token ? <Dashboard token={token} setToken={setToken} /> : <Navigate to="/" />} />
          <Route path="/update-health" element={token ? <UpdateHealthData token={token} /> : <Navigate to="/" />} />
          <Route path="/check-symptoms" element={token ? <CheckSymptoms token={token} /> : <Navigate to="/" />} />
          <Route path="/mental-health-resources" element={token ? <MentalHealthResources token={token} /> : <Navigate to="/" />} />
          <Route path="/nutrition-plan" element={token ? <NutritionPlan token={token} /> : <Navigate to="/" />} />
          <Route path="/fitness-tracker" element={token ? <FitnessTracker token={token} /> : <Navigate to="/" />} />
          <Route path="/book-appointment" element={token ? <BookAppointment token={token} /> : <Navigate to="/" />} />
          <Route path="/access-request" element={token ? <AccessRequest token={token} /> : <Navigate to="/" />} />
          <Route path="/appointment-reminders" element={token ? <AppointmentReminders token={token} /> : <Navigate to="/" />} />
          <Route path="/reproductive-health-articles" element={token ? <ReproductiveHealthArticles token={token} /> : <Navigate to="/" />} />
          <Route path="/menstrual-tracker" element={token ? <MenstrualTracker token={token} /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;