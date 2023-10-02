import React, { useState } from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';

function Verification() {
  const [verificationCode, setVerificationCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();


  const handleVerificationSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send the verification code to the backend
      const response = await axios.post('http://localhost:5000/verify', {
        code: verificationCode,
      });

      if (response.data.success) {
        // Verification was successful, handle as needed (e.g., redirect)
        console.log('Verification successful');
        alert("verification successful")
        navigate('/login')
      } else {
        setErrorMessage('Invalid verification code. Please try again.');
        alert("please veify your email")
      }
    } catch (error) {
      console.error('An error occurred:', error);
      alert(error)
      setErrorMessage("please verify your email")
    }
  };

  return (
    <div>
      <h2>Verification</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <form onSubmit={handleVerificationSubmit}>
        <label htmlFor="verificationCode">Enter 6-digit code:</label>
        <input
          type="text"
          id="verificationCode"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          maxLength={6} // Enforce a maximum length of 6 characters
        />
        <button type="submit">Verify</button>
      </form>
      <div><NavLink to='/resand'>Resand verify email</NavLink></div>
    </div>
  );
}

export default Verification;
