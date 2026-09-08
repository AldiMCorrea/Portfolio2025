import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Technologies from './components/Technologies';
import Resume from './components/Resume';
import Projects from './components/Projects';
import Contact from './components/Contact';
import TypingEffect from './components/TypingEffect';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  return (
    <div className="App">
      <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
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
