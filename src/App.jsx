// src/App.jsx
import './App.css';
import MovieList from './components/MovieList';

function App() {
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src="/react.svg" className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>React + Flask CRUD</h1>
      <div className="card">
        <MovieList />
      </div>
    </>
  );
}

export default App;