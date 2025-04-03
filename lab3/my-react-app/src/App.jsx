import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CarsList from './Components/CarList';
import BookingsList from './Components/BookingList';
import CompanyInfo from './Components/CompanyInfo';
import CarDetails from './Components/CarDetails';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <header>
          <h1>Оренда Авто</h1>
          <nav>
            <ul>
              <li><Link to="/cars">Автомобілі</Link></li>
              <li><Link to="/bookings">Мої бронювання</Link></li>
              <li><Link to="/about">Про нас</Link></li>
            </ul>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/cars" element={<CarsList />} />
            <Route path="/bookings" element={<BookingsList />} />
            <Route path="/about" element={<CompanyInfo />} />
            <Route path="/car/:carId" element={<CarDetails />} />
          </Routes>
        </main>

        <footer>
          <div className="footer-content">
            <p>&copy; 2025 Оренда Авто</p>
            <p>Ясна вулиця 16, Львів, Львівський район</p>
            <p><a href="tel:+380123456789">+380123456789</a></p>
            <p><a href="mailto:orendaautolviv@gmail.com">orendaautolviv@gmail.com</a></p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
