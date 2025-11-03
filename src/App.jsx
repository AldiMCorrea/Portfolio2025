import './App.css';
import './dark-mode.css';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Contact from './components/Contact';
import Projects from './components/Projects';
import Technologies from './components/Technologies';
import { useState } from 'react';

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
        <Contact />
      </main>
    </div>
  );
}

export default App;
