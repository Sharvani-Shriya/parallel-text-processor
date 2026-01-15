import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/UI/Button';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleStartProcess = () => {
    navigate('/process');
  };

  const handleGoToProfile = () => {
    navigate('/profile');
  };

  return (
    <div className="dashboard-container">
      <div className="welcome-section">
        <h1 className="welcome-title animate-fade-in">Welcome to Text Processor</h1>
        <p className="welcome-subtitle animate-slide-up">
          Your powerful tool for parallel text analysis and sentiment scoring
        </p>
      </div>

      <div className="dashboard-options animate-scale-in">
        <div className="option-card" onClick={handleStartProcess}>
          <div className="option-icon">🚀</div>
          <h3>Start Processing</h3>
          <p>Upload and analyze your text files with advanced parallel processing</p>
          <Button className="option-button">Get Started</Button>
        </div>

        <div className="option-card" onClick={handleGoToProfile}>
          <div className="option-icon">👤</div>
          <h3>Profile</h3>
          <p>Manage your account settings and preferences</p>
          <Button className="option-button">View Profile</Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;