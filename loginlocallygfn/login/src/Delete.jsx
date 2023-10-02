import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch the user's data from the backend when the component mounts
    axios.get('http://localhost:5000/api/user', { withCredentials: true })
      .then((response) => {
        localStorage.setItem('userSession', JSON.stringify(response.data.user));
        setUser(response.data.user);
        console.log(response.data.user);
      })
      .catch((error) => {
        // Handle authentication errors or redirects here
      });
  }, []);

  return (
    <div>
      <h2>User Profile</h2>
      {user ? (
        <div>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <img src={user.image} alt="User" />
          <p>Is Verified: {user.isVerified ? 'Yes' : 'No'}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}

export default UserProfile;
