import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { simulatedSignUp } from '../../api/authApi';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Simulate API call to register user
      await simulatedSignUp(email, password, name);
      alert('Sign Up successful! Please log in.');
      // Redirect to the login page after successful registration
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Sign Up failed. Please try again.');
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Create Account</h2>
      <p className="auth-subtitle">Get started with Parallel Text Processor</p>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <p className="error-message">{error}</p>}

        <Input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength="6"
        />
        <Button type="submit">Sign Up</Button>
      </form>
      <p>
        Already have an account? <Link to="/login">Log In</Link>
      </p>
    </div>
  );
};

export default SignUp;