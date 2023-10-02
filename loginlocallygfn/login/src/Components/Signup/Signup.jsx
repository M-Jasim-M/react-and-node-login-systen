import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

function Signup() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(true);

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    console.log('Selected Image:', imageFile);
    setSelectedImage(imageFile);
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();

  const submitForm = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please enter the same password.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('profileImage', selectedImage);
console.log(formData);
      const response = await axios.post('http://localhost:5000/signup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setErrorMessage('Success');
        // Redirect to login or any other page as needed
        navigate('/verify');
      } else {
        setErrorMessage('Email already exists. Please use a different email address.');
        // alert('Email already exists. Please use a different email address.');
      }
    } catch (error) {
      setErrorMessage(`An error occurred: ${error.message}`);
      alert('Email already exists. Please use a different email address.');
    }
  };

  return (
    <div className="smain">
      <div className="logindiv">Create Account</div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <input type="text" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <div className="paswardinput">
        <input
          type={showPassword ? 'password' : 'text'}
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <i onClick={togglePassword} className="fa-solid fa-eye"></i>
      </div>
      <div className="paswardinput">
        <input
          type={showPassword ? 'password' : 'text'}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <i id="secondpng" onClick={togglePassword} className="fa-solid fa-eye "></i>
      </div>
      <div>
        <div className="image-preview">
          {selectedImage && <img src={URL.createObjectURL(selectedImage)} alt="Selected" />}
        </div>
        <div className="imageupload">
          <input type="file" accept=".jpg, .jpeg, .png" onChange={handleImageChange} id="imageInput" />
          <label htmlFor="imageInput">
            <i className="fa-solid fa-plus"></i>
          </label>
        </div>
      </div>
      <button onClick={submitForm}>Create Account</button>
      <img src={selectedImage ? URL.createObjectURL(selectedImage) : ''} alt="Selected" />
    </div>
  );
}

export default Signup;
