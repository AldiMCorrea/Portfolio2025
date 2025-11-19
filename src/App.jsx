import './App.css';
import './dark-mode.css';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
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
        <WorkExperience />
        <Education />
        <Contact />
        <TypingEffect text="\"The best way to predict the future is to invent it.\" - Alan Kay" />
      </main>
    </div>
  );
}

export default App;
