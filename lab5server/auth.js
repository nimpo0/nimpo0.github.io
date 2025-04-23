const { db } = require('./firebaseConfig'); // Використовуємо ініціалізовану db
const admin = require('firebase-admin'); // Для auth() і FieldValue
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
dotenv.config();

// Конфігурація секрету для JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Реєстрація нового користувача
const registerUser = async (email, password) => {
  try {
    // Перевірка чи вже існує такий користувач
    const userQuery = await db.collection('users').where('email', '==', email).get();
    if (!userQuery.empty) {
      throw new Error('Користувач з таким email вже існує');
    }

    // Хешування паролю
    const hashedPassword = await bcrypt.hash(password, 10);

    // Створення користувача в Firestore
    const userRef = await db.collection('users').add({
      email,
      password: hashedPassword,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Генерація JWT токену
    const token = jwt.sign({ userId: userRef.id }, JWT_SECRET, { expiresIn: '1h' });

    return { token, uid: userRef.id, email };
  } catch (error) {
    throw new Error('Помилка при реєстрації: ' + error.message);
  }
};

// Логін користувача
const loginUser = async (email, password) => {
  try {
    // Пошук користувача
    const userQuery = await db.collection('users').where('email', '==', email).get();

    if (userQuery.empty) {
      throw new Error('Користувача не знайдено');
    }

    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();

    // Перевірка паролю
    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      throw new Error('Неправильний пароль');
    }

    // Генерація токену
    const token = jwt.sign({ userId: userDoc.id, email }, JWT_SECRET, { expiresIn: '1h' });

    return { token, uid: userDoc.id, email };
  } catch (error) {
    throw new Error('Помилка при логіні: ' + error.message);
  }
};

// Middleware для перевірки токену
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']; // Bearer <token>
  const token = authHeader && authHeader.split(' ')[1]; // Отримуємо токен з заголовка

  if (!token) {
    return res.status(401).json({ message: 'Токен не надано' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Невірний токен' });
    req.user = user; // Додаємо user (userId, email) до запиту
    next();
  });
};

module.exports = {
  registerUser,
  loginUser,
  authenticateToken,
};
