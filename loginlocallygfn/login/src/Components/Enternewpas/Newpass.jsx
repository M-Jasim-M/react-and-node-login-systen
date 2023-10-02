import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token');

  useEffect(() => {
    if (!token) {
      // Token not found in URL, handle it as needed (e.g., show an error message)
      setErrorMessage('Token not found in the URL.');
    }
  }, [token]);

  const handleResetPassword = async () => {
    try {
      const response = await axios.post('http://localhost:5000/reset-password', {
        token,
        newPassword,
      });

      if (response.data.success) {
        setSuccessMessage('Password reset successful. You can now log in with your new password.');
        navigate('/login');
      } else {
        setErrorMessage('Invalid or expired reset token. Please request a new reset link.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setErrorMessage('An error occurred while resetting your password.');
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      <label htmlFor="newPassword">Enter your new password:</label>
      <input
        type="password"
        id="newPassword"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={handleResetPassword}>Reset Password</button>
    </div>
  );
}

export default ResetPassword;
