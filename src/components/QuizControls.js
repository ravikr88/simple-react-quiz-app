// src/components/QuizControls.js
import React from "react";

const QuizControls = ({ onSubmit }) => {
  return (
    <div>
      <button onClick={onSubmit}>Submit Quiz</button>
    </div>
  );
};

export default QuizControls;
