import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import CarsList from './Components/CarList';
import BookingsList from './Components/BookingList';
import CompanyInfo from './Components/CompanyInfo';
import CarDetails from './Components/CarDetails';
import { getAuth, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import LoginAndSignup from './Authorization/LoginAndSignup';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [userToken, setUserToken] = useState(null);  // Додаємо стан для токену
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    unsubscribe();
  }, []);

  const fetchCars = async () => {
    if (!userToken) {
      alert('Для доступу потрібно авторизуватися');
      return;
    }

    const response = await fetch('http://localhost:5000/api/cars', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,  // Додаємо токен
      },
    });

    const data = await response.json();
    // Далі обробка даних
  };

  const handleSignOut = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      setUserToken(null);  // Очищаємо токен при виході
      alert('Ви успішно вийшли!');
    } catch (error) {
      alert(`Помилка: ${error.message}`);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleLogin = async (email, password) => {
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password); 
      const user = auth.currentUser;
      const token = await user.getIdToken();  // Отримуємо токен
      setUserToken(token);  // Зберігаємо токен в стані
      alert('Ви успішно ввійшли!');
      closeModal();
    } catch (error) {
      alert('Неправильний пароль або електронна пошта!');
    }
  };

  const handleSignUp = async (email, password) => {
    const auth = getAuth();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Ви успішно зареєструвались!');
      closeModal();
    } catch (error) {
      alert('Пароль має складатись з мінімум 6 символів!');
    }
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
}

export default App;
