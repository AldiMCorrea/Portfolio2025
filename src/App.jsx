import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Technologies from './components/Technologies';
import Resume from './components/Resume';
import Projects from './components/Projects';
import Contact from './components/Contact';
import TypingEffect from './components/TypingEffect';

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

function App() {
  const [theme, setTheme] = useState(getInitialTheme);

  // Stamp the explicit choice on <html> so it always wins over the OS/browser
  // preference, in both directions (light chosen while OS is dark, and vice versa).
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="App">
      <Header toggleTheme={toggleTheme} isDarkMode={theme === 'dark'} />
      <main>
        <Hero />
        <About />
        <Technologies />
        <Resume />
        <Projects />
        <Contact />
        <TypingEffect phrases={[
          `"The best way to predict the future is to invent it." - Alan Kay`,
          `"The only way to do great work is to love what you do." - Steve Jobs`,
          `"The future belongs to those who believe in the beauty of their dreams." - Eleanor Roosevelt`
        ]} />
      </main>
    </div>
  );
}

export default App;
