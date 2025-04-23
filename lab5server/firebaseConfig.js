// firebaseConfig.js

const admin = require('firebase-admin');
const serviceAccount = require('./lab4-862cd-firebase-adminsdk-fbsvc-f05ac66852.json');

// Перевірка чи вже ініціалізовано додаток Firebase
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('Firebase app initialized');
} else {
  console.log('Firebase app already initialized');
}

const db = admin.firestore(); // Підключення до Firestore

module.exports = { db }; // Експортуємо db для використання в інших файлах
