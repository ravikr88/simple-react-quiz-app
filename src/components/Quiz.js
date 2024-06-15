// src/components/Quiz.js
import React, { useState, useEffect } from "react";
import questions from "../questions.json";
import Question from "./Question";
import Timer from "./Timer";
import QuizControls from "./QuizControls";

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isFullscreen, setIsFullscreen] = useState(
    !!document.fullscreenElement
  );
  const [quizEnded, setQuizEnded] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem("quizState");
    if (savedState) {
      const { currentQuestion, answers, timeLeft, quizEnded } =
        JSON.parse(savedState);
      setCurrentQuestion(currentQuestion);
      setAnswers(answers);
      setTimeLeft(timeLeft);
      setQuizEnded(quizEnded);
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleQuizEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!quizEnded) {
      localStorage.setItem(
        "quizState",
        JSON.stringify({ currentQuestion, answers, timeLeft, quizEnded })
      );
    } else {
      localStorage.removeItem("quizState");
    }
  }, [currentQuestion, answers, timeLeft, quizEnded]);

  const handleAnswer = (option) => {
    setAnswers({
      ...answers,
      [currentQuestion]: option,
    });
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleQuizEnd();
    }
  };

  const handleQuizEnd = () => {
    setQuizEnded(true);
    setCurrentQuestion(0); // Reset current question on quiz end (optional)
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleSubmit = () => {
    handleQuizEnd();
  };

  useEffect(() => {
    const fullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", fullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", fullscreenChange);
  }, []);

  if (!isFullscreen) {
    return (
      <div>
        <p>Please enable full screen to start the quiz.</p>
        <button onClick={handleFullscreen}>Enable Fullscreen</button>
      </div>
    );
  }

  if (quizEnded) {
    // Calculate score or show answers summary
    const score = calculateScore(answers);
    return (
      <div>
        <h2>Quiz Ended</h2>
        <p>Your answers have been submitted.</p>
        <p>
          Score: {score} / {questions.length}
        </p>
        {/* Optionally, display detailed answers or review here */}
      </div>
    );
  }

  return (
    <div>
      <Question
        question={questions[currentQuestion].question}
        options={questions[currentQuestion].options}
        onAnswer={handleAnswer}
      />
      <Timer timeLeft={timeLeft} />
      <QuizControls onSubmit={handleSubmit} />
    </div>
  );
};

export default Quiz;

// Helper function to calculate score based on answers
const calculateScore = (answers) => {
  let score = 0;
  questions.forEach((question, index) => {
    if (question.answer === answers[index]) {
      score++;
    }
  });
  return score;
};
