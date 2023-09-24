import "./App.css";
import React, { useEffect, useState } from "react";
import wordscramble from "wordscramble";

function App() {
  const [userInput, setUserInput] = useState("");
  const [word, setWord] = useState("");
  const [scrambledWord, setScrambledWord] = useState("");
  const [score, setScore] = useState(0);
  const [hint, setHint] = useState("");
  const [hintLevel, setHintLevel] = useState(0);
  const [wrongMessage, setWrongMessage] = useState("");
  const [timer, setTimer] = useState(60);
  const initialTimer = 60;

  useEffect(() => {
    fetchWord();
  }, []);

  useEffect(() => {
    if (word) {
      scrambleWord();
    }
  }, [word]);

  useEffect(() => {
    let timerId;
    if (timer > 0) {
      timerId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      fetchNewWord();
    }
    return () => clearInterval(timerId);
  }, [timer]);

  const resetHint = () => {
    setHint("");
    setHintLevel(0);
  };

  const handleHintClick = () => {
    if (word && hintLevel < word.length) {
      const hintLetters = word.substring(0, hintLevel + 1);
      const hintMessage =
        hintLevel === 0
          ? `The first letter is '${hintLetters}'`
          : `The ${ordinal(hintLevel + 1)} letter is '${hintLetters}'`;
      setHint(hintLetters);
      setHintLevel(hintLevel + 1);
    }
  };

  const ordinal = (n) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
  };

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleCheckAnswer();
    }
  };

  const fetchNewWord = () => {
    fetchWord();
    resetHint();
    setTimer(initialTimer);
  };

  const fetchWord = async () => {
    try {
      const response = await fetch("http://localhost:3001/getWord");
      const data = await response.json();
      setWord(data.word);
      console.log(data.word);
      scrambleWord();
    } catch (error) {
      console.error("Errror fetching scrambled word:", error);
    }
  };

  const scrambleWord = () => {
    setScrambledWord(wordscramble.scramble(word));
  };

  const checkAnswer = () => {
    return userInput.toLowerCase() === word.toLowerCase();
  };

  const handleCheckAnswer = () => {
    const isCorrect = checkAnswer();
    if (isCorrect) {
      setScore(score + 1);
      fetchWord();
      setUserInput("");
      resetHint();
      setWrongMessage("");
      setTimer(initialTimer);
    } else {
      setWrongMessage("Incorrect answer. Try again!");
      setUserInput("");
    }
  };

  return (
    <div className="App">
      <h1>EKREB! </h1>
      <h1>
        <div className="instruction">
          {" "}
          Below is a scrambled word. Try your best to unscramble it... if you
          can{" "}
        </div>
        <div>
          <span className="time-left">Time left: {timer} seconds </span>
        </div>
        {timer == 0 && <div>Time is up! Fetching a new word...</div>}
      </h1>
      <div className="word-section">
        {/* Add this className */}
        {/* Display the scrambled word */}
        <div className="scrambled-word">Scrambled Word: {scrambledWord}</div>
        <div className="hint">Hint: {hint}</div> {/*Display the hint */}
      </div>
      <input
        type="text"
        value={userInput}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="Enter unscrambled word"
        className="input-box"
      />
      <div className="button-container">
        <button onClick={handleHintClick} className="hint-button">
          Hint
        </button>{" "}
        <button onClick={handleCheckAnswer} className="check-button">
          Check Answer
        </button>
        <button onClick={fetchNewWord} className="new-word-button">
          New Word
        </button>
      </div>
      <div className="score">Score: {score}</div>
      {wrongMessage && <div className="wrong-message">{wrongMessage}</div>}
    </div>
  );
}

export default App;
