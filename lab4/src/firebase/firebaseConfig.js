import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";  

const firebaseConfig = {
  apiKey: "AIzaSyDENttc9nQNmf-eNgHD16jiSUIPlD3BYFw",
  authDomain: "lab4-862cd.firebaseapp.com",
  projectId: "lab4-862cd",
  storageBucket: "lab4-862cd.firebasestorage.app",
  messagingSenderId: "547403019115",
  appId: "1:547403019115:web:eee15206baeb8fdab8922e"
};

const app = initializeApp(firebaseConfig);
export default app; 

const firestoreDB = getFirestore(app);
export { firestoreDB }; 
