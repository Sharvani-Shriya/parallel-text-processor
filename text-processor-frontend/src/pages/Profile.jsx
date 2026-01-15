import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSave = () => {
    // Update the user data in context and localStorage
    const updatedUser = { ...user, name, email };
    updateUser(updatedUser);
    setIsEditing(false);
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="profile-container animate-fade-in">
      <div className="profile-header">
        <Button onClick={handleBack} className="back-button">← Back to Dashboard</Button>
        <h1>User Profile</h1>
        <p>Manage your account information</p>
      </div>

      <div className="profile-card animate-slide-up">
        <div className="profile-avatar">
          <div className="avatar-circle">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        </div>

        <div className="profile-info">
          {isEditing ? (
            <div className="edit-form">
              <Input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="button-group">
                <Button onClick={handleSave} className="save-button">Save Changes</Button>
                <Button onClick={() => setIsEditing(false)} className="cancel-button">Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="info-display">
              <div className="info-item">
                <label>Name:</label>
                <span>{user?.name || 'Not set'}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{user?.email || 'Not set'}</span>
              </div>
           
              <Button onClick={() => setIsEditing(true)} className="edit-button">Edit Profile</Button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-actions animate-scale-in">
        <Button onClick={handleLogout} className="logout-button-large">Logout</Button>
      </div>
    </div>
  );
};

export default Profile;