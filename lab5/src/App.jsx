import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import CarsList from './Components/CarList';
import BookingsList from './Components/BookingList';
import CompanyInfo from './Components/CompanyInfo';
import CarDetails from './Components/CarDetails';
import LoginAndSignup from './Authorization/LoginAndSignup';
import ProtectedRoute from './Components/ProtectedRoute';
import './App.css';

const apiUrl = 'https://orenda-avto-server.onrender.com';

const App = () => {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Токен:', token);
  
      const res = await fetch(`${apiUrl}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
  
      if (!res.ok) {
        throw new Error('Не вдалося отримати профіль');
      }
  
      const data = await res.json();
      console.log('Профіль:', data);
  
      if (data) {
        setUser(data);
        console.log('Профіль оновлено:', data);
      }
  
    } catch (error) {
      console.error('Помилка отримання профілю:', error);
      setUser(null);
    }
  };  

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchProfile();
    } else {
      setUser(null);
    }
  }, []);
  
  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUser(null);
    alert('Ви успішно вийшли!');
    window.location.href = "/cars";
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleLogin = (email, password) => {
    fetch(`${apiUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Невірний логін або пароль');
        }
        return response.json();
      })
      .then(data => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          return fetchProfile(data.token);
        } else {
          throw new Error('Не вдалося увійти');
        }
      })
      .then(() => {
        fetchProfile();
        alert('Ви успішно ввійшли!');
        closeModal();
      })
      .catch(error => {
        alert(error.message);
      });
  };

  const handleSignUp = (email, password) => {
    fetch(`${apiUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(errorData => {
            throw new Error(errorData.message || 'Сталася помилка при реєстрації');
          });
        }
        return response.json();
      })
      .then(data => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          return fetchProfile(data.token);
        } else {
          throw new Error('Не вдалося зареєструватися');
        }
      })
      .then(() => {
        fetchProfile();
        alert('Реєстрація пройшла успішно!');
        closeModal();
      })
      .catch(error => {
        alert('Помилка: ' + error.message);
        console.error('Помилка реєстрації:', error);
      });
  };

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
              {!user ? (
                <>
                  <li><button className="login-button" onClick={openModal}>Увійти</button></li>
                  <LoginAndSignup 
                    isOpen={isModalOpen} 
                    onClose={closeModal} 
                    onLogin={handleLogin} 
                    onSignUp={handleSignUp}
                  />
                </>
              ) : (
                <li>
                  <button id="login" className="login-button" onClick={handleSignOut}>Вийти</button> 
                </li>
              )}
            </ul>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/cars" element={<CarsList />} />
            <Route 
              path="/bookings" 
              element={
                <ProtectedRoute>
                  <BookingsList />
                </ProtectedRoute>
              } 
            />
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
