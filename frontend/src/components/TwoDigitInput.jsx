import React, { useRef, useEffect } from 'react';

import "../Assets/css/addMachine.css"

const TwoDigitInput = ({ value, onChange, numInputs }) => {
  const inputRefs = useRef([]);

  const handleChange = (index, event) => {
    const newValue = [...value];
    const input = event.target.value;

    // Ensure only numbers and limit to 2 digits
    if (/^[A-Fa-f0-9]{0,2}$/.test(input)) {
      newValue[index] = input;
      onChange(newValue);

      // Move to the next input if current input has two digits and it's not the last input
      if (input.length === 2 && index < numInputs - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && value[index].length === 0 && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  useEffect(() => {
    // Initialize refs array to ensure it has the correct length
    inputRefs.current = inputRefs.current.slice(0, numInputs);
  }, [numInputs]);

  return (
    <>
    <div className="two-digit-inputs">
      {Array(numInputs).fill(0).map((_, index) => (
        <input
          key={index}
          type="text"
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          maxLength="2"
          ref={el => inputRefs.current[index] = el}
          className="input-box-2digit input-box"
        />
      ))}
    </div>
    </>
  );
};

export default TwoDigitInput;