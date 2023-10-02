// OTPInput.js
import React, { useState, useRef } from 'react';
import './Sixdigit.css'

function OTPInput() {
  const [otp, setOTP] = useState(['', '', '', '', '', '']);
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const handleInputChange = (e, index) => {
    const value = e.target.value;

    // Ensure that only numeric characters are entered
    if (/^\d+$/.test(value) || value === '') {
      setOTP((prevOTP) => {
        const newOTP = [...prevOTP];
        newOTP[index] = value;
        return newOTP;
      });

      // Focus on the next input box if available
      if (index < 5 && value !== '') {
        inputRefs[index + 1].current.focus();
      }
     
    }
   
  };
  // setOTP(['', '', '', '', '', ''])
  const handleBackspace = (e, index) => {
    // Move to the previous input box on backspace if the current box is empty
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs[index - 1].current.focus();
    }
  };

  return (
    <div className='mainotp'>
      <div className="otp-input-container">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            placeholder="0"
            value={digit}
            onChange={(e) => handleInputChange(e, index)}
            onKeyUp={(e) => handleBackspace(e, index)}
            maxLength={1}
            ref={inputRefs[index]}
          />
        ))}
      </div>
      <button onClick={() => console.log(otp.join(''))}>Submit OTP</button>
      {otp}
    </div>
  );
}

export default OTPInput;
