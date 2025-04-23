const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { registerUser, loginUser, authenticateToken } = require('./auth'); // Імпортуємо функції
const path = require('path');
const { db } = require('./firebaseConfig'); // Підключаємо Firestore
dotenv.config();

const app = express();
app.use(express.json());

// Встановлюємо CORS для дозволу запитів з React
app.use(cors({
  origin: 'http://localhost:3000',
}));

app.use(express.static(path.join(__dirname, '../my-react-app/build')));

// 🔹 Реєстрація
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await registerUser(email, password);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Не вдалося зареєструвати користувача' });
  }
});

// 🔹 Логін
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await loginUser(email, password);
    res.status(200).json(user);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

// 🔹 Профіль (захищений маршрут)
app.get('/profile', authenticateToken, (req, res) => {
  res.json({ uid: req.user.userId, email: req.user.email });
});

const bookingsRoute = require('./routes/bookings');
app.use('/api/bookings', bookingsRoute);

app.get('/api/getUserData', authenticateToken, async (req, res) => {
  const uid = req.user.userId;

  try {
    const userRef = db.collection('users').doc(uid);
    const userSnapshot = await userRef.get();

    if (!userSnapshot.exists) {
      return res.status(404).json({ message: 'Користувача не знайдено!' });
    }

    return res.status(200).json({
      uid,
      ...userSnapshot.data(),
    });
  } catch (error) {
    console.error('Помилка при отриманні користувача:', error);
    return res.status(500).json({ message: 'Внутрішня помилка сервера' });
  }
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../my-react-app/build', 'index.html'));
});
