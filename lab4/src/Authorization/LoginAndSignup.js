import React, { useState } from 'react';
import './LoginAndSignup.css'; // Оновлені стилі

const LoginAndSignup = ({ isOpen, onClose, onLogin, onSignUp }) => {
  const [isLogin, setIsLogin] = useState(true); 

  const handleFormSwitch = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    if (isLogin) {
      onLogin(email, password); 
    } else {
      onSignUp(email, password); 
    }
  };

  return (
    isOpen && (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="close-btn" onClick={onClose}>✕</button> 
          <h5>{isLogin ? 'УВІЙТИ' : 'ЗАРЕЄСТРУВАТИСЬ'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className="input-group">
              <label htmlFor="password">Пароль:</label>
              <input type="password" id="password" name="password" required />
            </div>
            <button className="submit-btn" type="submit">{isLogin ? 'Увійти' : 'Зареєструватися'}</button>
          </form>
          <p className="switch-text">
            {isLogin ? 'Ще не зареєстровані?' : 'Вже маєте акаунт?'}
            <span onClick={handleFormSwitch}>
              {isLogin ? ' Зареєструйтесь' : ' Увійдіть'}
            </span>
          </p>
        </div>
      </div>
    )
  );
};

export default LoginAndSignup;
