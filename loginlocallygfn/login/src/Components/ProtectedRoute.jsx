import React, { useEffect } from 'react';
import {Navigate } from 'react-router-dom';
import { useUserSession } from './UserSessionContext';

function ProtectedRoutes({ children }) {
  // const navigate = useNavigate();
  const userSession = useUserSession(); // Use the correct variable name 'token'

  // If there is no session, navigate to the login page
    if (!userSession.token) {
      // Perform the navigation inside the useEffect hook
      return <Navigate to="/login" />
    }
    // Add token as a dependency if necessary

  // Render the children only if there is a session
  return children;
}

export default ProtectedRoutes;
