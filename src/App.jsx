import React, { useState } from 'react';
import './App.css';
import './dark-mode.css';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Technologies from './components/Technologies';
import WorkExperience from './components/WorkExperience';
import Education from './components/Education';
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
        <Projects />
        <Technologies />
        {/* <WorkExperience /> */}
        {/* <Education /> */}
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
