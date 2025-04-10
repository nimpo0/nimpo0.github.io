import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import CarsList from './Components/CarList';
import BookingsList from './Components/BookingList';
import CompanyInfo from './Components/CompanyInfo';
import CarDetails from './Components/CarDetails';
import { getAuth, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import LoginAndSignup from './Authorization/LoginAndSignup';
//import UploadCarsToFirestore from './todatabase';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);
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

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      alert('Ви успішно вийшли!');
    } catch (error) {
      console.error('Помилка: ', error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleLogin = (email, password) => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        alert('Ви успішно ввійшли!');
        closeModal(); 
      })
      .catch(() => {
        alert('Неправильний пароль або електронна пошта!');
      });
  };

  const handleSignUp = (email, password) => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        alert('Ви успішно зареєструвались!');
        closeModal();
      })
      .catch(() => {
        alert('Пароль має складатись з мінімум 6 символів!');
      });
  };

  return (
    <Router>
      <div className="App">
        <header>
          {/*<UploadCarsToFirestore /> */}
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
                  <button id = "login" className="login-button" onClick={handleSignOut}>Вийти</button> 
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
