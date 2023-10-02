// // // // Dashboard.js

// // // import React from 'react';
// // // import './Dashboard.css';
// // // import { useUserSession } from '../UserSessionContext';
// // // import { useNavigate } from 'react-router-dom';

// // // function Dashboard() {
// // //   const userSession = useUserSession(); // Renamed to userSession to avoid naming conflict
// // // const navigate = useNavigate();
// // //   const handleLogout = () => {
// // //     userSession.logout(); // Call the logout function to clear the token
// // //     navigate("/login")
// // //   };

// // //   return (
// // //     <>
// // //       This is the Dashboard
// // //       <button onClick={handleLogout}>Logout</button>
// // //     </>
// // //   );
// // // }

// // // export default Dashboard;

// // // User.js
// // // import React, { useState, useEffect } from 'react';
// // // import { useUserSession } from '../UserSessionContext';
// // // import { useNavigate } from 'react-router-dom';

// // // function Dashboard() {
// // //   const [user, setUser] = useState(null);
// // //   const [formData, setFormData] = useState({
// // //     name: '',
// // //     email: '',
// // //     profileImage: null,
// // //     image: user ? user.image : '',
// // //   });
// // //   const [toogle, setToggle] = useState(false);
// // //   const userSession1 = useUserSession();
// // //   const navigate = useNavigate();

// // //   useEffect(() => {
// // //     // When the component mounts, fetch user data from the backend
// // //     const userSession = JSON.parse(localStorage.getItem('userSession'));
// // //     const userEmail = userSession.data.email;

// // //     fetch(`http://localhost:5000/api/user/${userEmail}`, {
// // //       method: 'GET',
// // //       headers: {
// // //         'Content-Type': 'application/json',
// // //       },
// // //     })
// // //       .then((response) => response.json())
// // //       .then((data) => {
// // //         if (data.success) {
// // //           const userData = data.user;
// // //           setUser(userData);
// // //           setFormData({
// // //             name: userData.name,
// // //             email: userData.email,
// // //           });
// // //         } else {
// // //           console.error('Failed to fetch user data');
// // //         }
// // //       })
// // //       .catch((error) => {
// // //         console.error('Error fetching user data:', error);
// // //       });
// // //   }, []); // Empty dependency array ensures this effect runs only once when the component mounts

// // //   const handleLogout = () => {
// // //     userSession1.logout();
// // //   };

// // //   const handleUpdate = async (e) => {
// // //     // Create a FormData object to send the updated data
// // //     e.preventDefault();
// // //     const updatedData = {
// // //       name: formData.name,
// // //       email: formData.email,
// // //       profileImage: formData.image,
// // //     };

// // //     try {
// // //       const response = await fetch('http://localhost:5000/update-profile', {
// // //         method: 'PUT',
// // //         body: JSON.stringify(updatedData),
// // //         headers: {
// // //           'Content-Type': 'application/json',
// // //         },
// // //       });

// // //       if (response.ok) {
// // //         const data = await response.json();
// // //         if (data.success) {
// // //           setUser(data.user); // Update the user data in the component state
// // //           setToggle(false); // Close the form
// // //         } else {
// // //           console.error('Profile update failed');
// // //         }
// // //       } else {
// // //         console.error('Profile update failed with status:', response.status);
// // //       }
// // //     } catch (error) {
// // //       console.error('Error updating profile:', error);
// // //     }
// // //   };

// // //   return (
// // //     <>
// // //       <div>
// // //         <h1>User Profile</h1>
// // //         {user ? (
// // //           <>
// // //             <p>Name: {user.name}</p>
// // //             <p>Email: {user.email}</p>
// // //             {/* Display the user's profile image */}
// // //             <img
// // //               onClick={() => setToggle(!toogle)}
// // //               src={`http://localhost:5000/${user.image}`}
// // //               alt="Profile"
// // //               width={300}
// // //               height={300}
// // //             />
// // //           </>
// // //         ) : (
// // //           <div>Loading...</div>
// // //         )}
// // //         <button onClick={handleLogout}>Logout</button>
// // //       </div>

// // //       {/* Display the Profile Update Form when the user is available */}
// // //       {toogle && (
// // //         <div>
// // //           <h2>Update Profile</h2>
// // //           <label>
// // //             Name:
// // //             <input
// // //               type="text"
// // //               value={formData.name}
// // //               onChange={(e) =>
// // //                 setFormData({ ...formData, name: e.target.value })
// // //               }
// // //             />
// // //           </label>
// // //           <br />
// // //           <label>
// // //             Email:
// // //             <input
// // //               type="email"
// // //               value={formData.email}
// // //               onChange={(e) =>
// // //                 setFormData({ ...formData, email: e.target.value })
// // //               }
// // //             />
// // //           </label>
// // //           <br />
// // //           <label>
// // //             Profile Image:
// // //             <input
// // //               type="file"
// // //               accept="image/*"
// // //               onChange={(e) =>
// // //                 setFormData({ ...formData, profileImage: e.target.files[0] })
// // //               }
// // //             />
// // //             <div><img src={`http://localhost:5000/${user.image}`} alt="" /></div>
// // //           </label>
// // //           <br />
// // //           <button onClick={handleUpdate}>Update</button>
// // //         </div>
// // //       )}
// // //     </>
// // //   );
// // // }

// // // export default Dashboard;

import React, { useState, useEffect } from 'react';
import { useUserSession } from '../UserSessionContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'

function Dashboard() {
  const [user, setUser] = useState(null);
  const[toogle, setToggle] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profileImage: null,
  });
  const [defaultImage, setDefaultImage] = useState('');
  const userSession1 = useUserSession();
  const navigate = useNavigate();

  useEffect(() => {
    // When the component mounts, fetch user data from the backend
    const userSession = JSON.parse(localStorage.getItem('userSession'));
    const userEmail = userSession.data.email;

    fetch(`http://localhost:5000/api/user/${userEmail}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const userData = data.user;
          setUser(userData);
          setDefaultImage(`http://localhost:5000/${userData.image}`); // Set the default image
          setFormData({
            name: userData.name,
            email: userData.email,
          });
        } else {
          console.error('Failed to fetch user data');
        }
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts

  const handleLogout = () => {
    userSession1.logout();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
  
    // Create a FormData object to send the updated data
    const updatedData = new FormData();
    updatedData.append('name', formData.name);
    updatedData.append('email', formData.email);
    updatedData.append('profileImage', formData.profileImage);
  
    // Log the updated data before sending it
    console.log('Updated Data:', updatedData);
  
    try {
      const response = await fetch('http://localhost:5000/update-profile', {
        method: 'PUT',
        body: updatedData, // Use the FormData object as the body
      });
  
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(data.user); // Update the user data in the component state
          // setDefaultImage(`http://localhost:5000/${data.user.image}`); // Update the default image
  
          // Log the updated user data
          console.log('Updated User Data:', data.user);
        } else {
          console.error('Profile update failed');
        }
      } else {
        console.error('Profile update failed with status:', response.status);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  

  return (
    <>
      <div>
        <h1>User Profile</h1>
        {user ? (
          <>
            <div className="web">
            <p>Welcome : {user.name}</p>
            <p>Email: {user.email}</p>
            {/* Display the user's profile image */}
            <img
              onClick={() => setToggle(!toogle)}
              src={`http://localhost:5000/${user.image}`}
              alt="Profile"
              width={300}
              height={300}
            />
            <button onClick={handleLogout}>Logout</button>
            </div>
            </>
        ) : (
          <div>Loading...</div>
        )}
        
      </div>

      {/* Display the Profile Update Form when the user is available */}
     {toogle && ( <div className='from'>
        <h2>Update Profile</h2>
        <label>
          Name:
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </label>
        <br />
        <label>
          Profile Image:
          <input
            type="file"
            accept="image/*"
            // onChange={(e) =>
            //   setFormData({ ...formData, profileImage: e.target.files[0] })
            // }
            // onChange={(e) => {
            //   setFormData({ ...formData, profileImage: e.target.files[0] });
            //   setDefaultImage(URL.createObjectURL(e.target.files[0])); // Set defaultImage to the URL of the selected image
            // }}
            onChange={(e) => {
              // Use the callback form of setFormData to ensure it's updated before accessing it
              setFormData((prevFormData) => ({
                ...prevFormData,
                profileImage: e.target.files[0],
              }));
              setDefaultImage(URL.createObjectURL(e.target.files[0])); // Set defaultImage to the URL of the selected image
            }}

          />
          {/* Display the default image */}
         <div> {defaultImage && <img src={defaultImage} alt="Default" width={250} height={250} />}</div>
        </label>
        <br />
        <button onClick={handleUpdate}>Update</button>
      </div>
      )}
    </>
  );
}

export default Dashboard;

// import React, { useState, useEffect } from 'react';
// import { useUserSession } from '../UserSessionContext';
// import { useNavigate } from 'react-router-dom';
// import './Dashboard.css';
// import axios from 'axios';

// function Dashboard() {
//   const [users, setUsers] = useState([]); // Initialize users as an empty array
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     profileImage: null,
//   });
//   const [defaultImage, setDefaultImage] = useState('');
//   const [toogle,setToggle] = useState(false);
//   const userSession1 = useUserSession();
//   const navigate = useNavigate();

//   useEffect(() => {
//     // When the component mounts, fetch user data from the backend for both Facebook and local users
//     const userSession = JSON.parse(localStorage.getItem('userSession'));
//     const userEmail = userSession.data.email;

//     // Fetch data for the logged-in user
//     fetch(`http://localhost:5000/api/user/${userEmail}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.success) {
//           const userData = data.user;
//           setUsers((prevUsers) => [...prevUsers, userData]); // Add the user data to the array
//           setDefaultImage(`http://localhost:5000/${userData.image}`);
//           setFormData({
//             name: userData.name,
//             email: userData.email,
//           });
//         } else {
//           console.error('Failed to fetch user data');
//         }
//       })
//       .catch((error) => {
//         console.error('Error fetching user data:', error);
//       });

//     // Fetch data for Facebook-authenticated users
//     // axios.get('http://localhost:5000/api/user', { withCredentials: true })
//     //   .then((response) => response.json())
//     //   .then((data) => {
//     //     console.log(data.user);
//     //     if (data.success) {
//     //       localStorage.setItem('userSession', JSON.stringify(data.user));
//     //       console.log(data.user);
//     //       // Add the Facebook users' data to the array
//     //       setUsers((prevUsers) => [...prevUsers, ...data.users]);
//     //     } else {
//     //       console.error('Failed to fetch Facebook user data');
//     //     }
//     //   })
//     axios.get('http://localhost:5000/api/user', { withCredentials: true })
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data.user);
//       if (data.success) {
//         localStorage.setItem('userSession', JSON.stringify(data.user));
//         console.log(data.user);
//         // Add the Facebook users' data to the array
//         const facebookUsers = data.users || []; // Provide an empty array if users doesn't exist
//         setUsers((prevUsers) => [...prevUsers, ...facebookUsers]);
//       } else {
//         console.error('Failed to fetch Facebook user data');
//       }
//     })
//       .catch((error) => {
//         console.error('Error fetching Facebook user data:', error);
//       });
//   }, []); // Empty dependency array ensures this effect runs only once when the component mounts

//   const handleLogout = () => {
//     userSession1.logout();
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();

//     // Create a FormData object to send the updated data
//     const updatedData = new FormData();
//     updatedData.append('name', formData.name);
//     updatedData.append('email', formData.email);
//     updatedData.append('profileImage', formData.profileImage);

//     // Log the updated data before sending it
//     console.log('Updated Data:', updatedData);

//     try {
//       const response = await fetch('http://localhost:5000/update-profile', {
//         method: 'PUT',
//         body: updatedData, // Use the FormData object as the body
//       });

//       if (response.ok) {
//         const data = await response.json();
//         if (data.success) {
//           // Update the user data in the array
//           const updatedUsers = users.map((user) => {
//             if (user._id === data.user._id) {
//               return data.user;
//             }
//             return user;
//           });
//           setUsers(updatedUsers);

//           // Log the updated user data
//           console.log('Updated User Data:', data.user);
//         } else {
//           console.error('Profile update failed');
//         }
//       } else {
//         console.error('Profile update failed with status:', response.status);
//       }
//     } catch (error) {
//       console.error('Error updating profile:', error);
//     }
//   };

//   return (
//     <>
//       <div>
//         <h1>User Profile</h1>
//         {users.map((user) => ( 
//           <div className="web">
//             <p>Welcome: {user.name}</p>
//             <p>Email: {user.email}</p>
//             {/* Display the user's profile image */}
//             <img
//               onClick={() => setToggle(!toogle)}
//               src={`http://localhost:5000/${user.image}`}
//               alt="Profile"
//               width={300}
//               height={300}
//             />
//             <button onClick={handleLogout}>Logout</button>
//           </div>
//         ))}
//       </div>

//       {/* Display the Profile Update Form when the user is available */}
//       {toogle && (
//         <div className="from">
//           <h2>Update Profile</h2>
//           <label>
//             Name:
//             <input
//               type="text"
//               value={formData.name}
//               onChange={(e) =>
//                 setFormData({ ...formData, name: e.target.value })
//               }
//             />
//           </label>
//           <br />
//           <label>
//             Email:
//             <input
//               type="email"
//               value={formData.email}
//               onChange={(e) =>
//                 setFormData({ ...formData, email: e.target.value })
//               }
//             />
//           </label>
//           <br />
//           <label>
//             Profile Image:
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => {
//                 // Use the callback form of setFormData to ensure it's updated before accessing it
//                 setFormData((prevFormData) => ({
//                   ...prevFormData,
//                   profileImage: e.target.files[0],
//                 }));
//                 setDefaultImage(URL.createObjectURL(e.target.files[0])); // Set defaultImage to the URL of the selected image
//               }}
//             />
//             {/* Display the default image */}
//             <div>
//               {defaultImage && (
//                 <img
//                   src={defaultImage}
//                   alt="Default"
//                   width={250}
//                   height={250}
//                 />
//               )}
//             </div>
//           </label>
//           <br />
//           <button onClick={handleUpdate}>Update</button>
//         </div>
//       )}
//     </>
//   );
// }
