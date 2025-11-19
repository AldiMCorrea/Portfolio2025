import React, { useState, useEffect } from 'react';
import './TypingEffect.css';

const TypingEffect = ({ text, speed = 150 }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(i));
      i++;
      if (i > text.length) {
        clearInterval(intervalId);
        setTimeout(() => {
          setDisplayedText('');
        }, 2000); // Wait 2 seconds before restarting
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  return (
    <div className="typing-effect-container">
      <span className="typing-effect-text">{displayedText}</span>
    </div>
  );
};

export default TypingEffect;
