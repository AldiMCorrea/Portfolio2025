import React, { useState, useEffect } from 'react';
import './TypingEffect.css';

const TypingEffect = ({ phrases, speed = 150, delay = 2000 }) => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleTyping = () => {
      const currentPhrase = phrases[phraseIndex];
      if (isDeleting) {
        setDisplayedText(currentPhrase.substring(0, displayedText.length - 1));
      } else {
        setDisplayedText(currentPhrase.substring(0, displayedText.length + 1));
      }

      if (!isDeleting && displayedText === currentPhrase) {
        setTimeout(() => setIsDeleting(true), delay);
      } else if (isDeleting && displayedText === '') {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    };

    const typingTimeout = setTimeout(handleTyping, isDeleting ? speed / 2 : speed);
    return () => clearTimeout(typingTimeout);
  }, [displayedText, isDeleting, phraseIndex, phrases, speed, delay]);

  return (
    <div className="typing-effect-container">
      <span className="typing-effect-text">{displayedText}</span>
    </div>
  );
};

export default TypingEffect;
