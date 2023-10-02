// // UserSessionContext.js
// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const UserSessionContext = createContext();

// export function UserSessionProvider({ children }) {
//   const [session, setSession] = useState(null);
//   // const navigate = useNavigate();

//   useEffect(() => {
//     // Fetch session data when the component mounts
//     fetchSessionData().then((data) => {
//       setSession(true);
//     });
//   }, []);

//   const fetchSessionData = async () => {
//     try {
//       // Check if the token exists in local storage
//       const token = localStorage.getItem('userSession');
  
//       if (!token) {
//         console.error('Token not found in local storage.');
//         return null;
//       }
  
//       // Make a request to your /get-session endpoint with the token in headers
//       const response = await fetch('http://localhost:5000/protected-api-endpoint', {
//         headers: {
//           Authorization: `Bearer ${token}`, // Send the token in the Authorization header
//         },
//       });
  
//       const data = await response.json();
//       if (data.success) {
//         console.log(data.session);
//         setSession(true);
//         return data.session;
//       }
//     } catch (error) {
//       console.error(error);
//     }
//     return null;
//   };
  

//   return (
//     <UserSessionContext.Provider value={session}>
//       {children}
//     </UserSessionContext.Provider>
//   );
// }

// export function useUserSession() {
//   return useContext(UserSessionContext);
// }
// AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const UserSessionContext = createContext();

export function UserSessionContextProvider({ children }) {
  // const [token, setToken] = useState(localStorage.getItem('userSession'));
  const [token, setToken] = useState(localStorage.getItem('userSession'));


  useEffect(() => {
    // Update the token value whenever it changes in localStorage
    setToken(localStorage.getItem('userSession'));
    setToken(true)
  }, []);

  const logout = () => {
    // Clear the token in localStorage
    localStorage.removeItem('userSession');
    // Set the token state to false
    setToken(false);
  };

  return (
    <UserSessionContext.Provider value={{token, logout}}>
      {children}
    </UserSessionContext.Provider>
  );
}

export function useUserSession() {
  return useContext(UserSessionContext);
}
