'use client';

import { useState, useEffect } from 'react';

interface TypewriterEffectProps {
  className?: string;
}

const TypewriterEffect: React.FC<TypewriterEffectProps> = ({ className }) => {
  const [displayText, setDisplayText] = useState('');
  const words = ['scholarships', 'lives', 'education'];
  const baseText = 'Transforming ';

  useEffect(() => {
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const intervalId = setInterval(() => {
      if (!isDeleting && charIndex <= words[wordIndex].length) {
        setDisplayText(baseText + words[wordIndex].substring(0, charIndex));
        charIndex++;
      } else if (isDeleting && charIndex >= 0) {
        setDisplayText(baseText + words[wordIndex].substring(0, charIndex));
        charIndex--;
      } else {
        isDeleting = !isDeleting;
        if (!isDeleting) {
          wordIndex = (wordIndex + 1) % words.length;
        }
      }
    }, 150); // Increased from 100 to 150 for slower effect

    return () => clearInterval(intervalId);
  }, []);

  return <p className={`${className} text-3xl`}>{displayText}</p>; // Increased text size
};

export default TypewriterEffect;
