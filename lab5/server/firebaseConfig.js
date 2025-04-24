const admin = require('firebase-admin');
const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('Firebase app initialized');
} else {
  console.log('Firebase app already initialized');
}

const db = admin.firestore();
module.exports = { db };
