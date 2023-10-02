import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const handleForgotPassword = async () => {
    try {
      const response = await axios.post('http://localhost:5000/forgot-password', {
        email,
      });

      if (response.data.success) {
        setSuccessMessage('Password reset email sent. Check your email for instructions.');
        navigate ("/reset")
      } else {
        setErrorMessage('User not found. Make sure you entered the correct email.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setErrorMessage('An error occurred while sending the password reset email.');
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      <label htmlFor="email">Enter your email:</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleForgotPassword}>Reset Password</button>
    </div>
  );
}

export default ForgotPassword;
