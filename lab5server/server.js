const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { registerUser, loginUser, authenticateToken } = require('./auth');
const path = require('path');
const { db } = require('./firebaseConfig');
dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'https://orenda-avto.netlify.app',
}));

app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await registerUser(email, password);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Не вдалося зареєструвати користувача' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await loginUser(email, password);
    res.status(200).json(user);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

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
    return res.status(500).json({ message: 'Помилка при отриманні користувача' });
  }
});

const buildPath = path.join(__dirname, 'nimpo0.github.io/lab5/build');
app.use(express.static(buildPath));

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, 'nimpo0.github.io/lab5/build/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
