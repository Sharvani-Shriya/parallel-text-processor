import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import { simulatedLogin } from '../../api/authApi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Simulate API call to check credentials
      const response = await simulatedLogin(email, password);

      if (!response.user) {
        throw new Error(response.error || "Login failed - No user data returned");
      }

      login(response.user);
      // Redirect to the protected homepage
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Welcome Back</h2>
      <p className="auth-subtitle">Sign in to continue to your dashboard</p>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <p className="error-message">{error}</p>}

        <Input
          type="email"
          placeholder="Email (e.g., user@example.com)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password (e.g., password)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Log In</Button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;