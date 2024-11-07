'use client';
import { useState, useEffect } from 'react';

const words = ["Education", "University Degree", "Dreams", "Future Plans", "Doctorate"];

const RotatingTypewriter = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    const typingSpeed = isDeleting ? 70 : 100;
    const word = words[currentWordIndex];

    if (!isDeleting && currentText === word) {
      setTimeout(() => setIsDeleting(true), 1500);
      return;
    }

    if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setCurrentText(prev => {
        if (isDeleting) {
          return prev.slice(0, -1);
        }
        return word.slice(0, prev.length + 1);
      });
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex]);

  const longestWord = words.reduce((a, b) => a.length > b.length ? a : b);

  return (
    <div style={{ 
      display: 'inline-block',
      minWidth: `${longestWord.length}ch`,
      textAlign: 'center'
    }}>
      {currentText}
      <span style={{ opacity: showCursor ? 1 : 0 }}>_</span>
    </div>
  );
};

export default RotatingTypewriter; 