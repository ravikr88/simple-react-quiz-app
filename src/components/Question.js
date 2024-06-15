// src/components/Question.js
import React from 'react';

const Question = ({ question, options, onAnswer }) => {
  return (
    <div>
      <h2>{question}</h2>
      {options.map((option, index) => (
        <button key={index} onClick={() => onAnswer(option)}>
          {option}
        </button>
      ))}
    </div>
  );
};

export default Question;
