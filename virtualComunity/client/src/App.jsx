import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LocationDetailPage from './pages/LocationDetailPage';
import AllEventsPage from './pages/AllEventsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/locations/:id" element={<LocationDetailPage />} />
          <Route path="/events" element={<AllEventsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
