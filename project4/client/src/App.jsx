import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CreateCar from './pages/CreateCar';
import ViewCar from './pages/ViewCar';
import EditCar from './pages/EditCar';
import AllCars from './pages/AllCars';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              🚗 DIY Delight
            </Link>
            <ul className="nav-menu">
              <li className="nav-item">
                <Link to="/" className="nav-link">Create Car</Link>
              </li>
              <li className="nav-item">
                <Link to="/customcars" className="nav-link">My Garage</Link>
              </li>
            </ul>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<CreateCar />} />
          <Route path="/customcars" element={<AllCars />} />
          <Route path="/customcars/:id" element={<ViewCar />} />
          <Route path="/edit/:id" element={<EditCar />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
