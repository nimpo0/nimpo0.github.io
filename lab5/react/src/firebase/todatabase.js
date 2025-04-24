import { setDoc, doc } from 'firebase/firestore';
import { useEffect } from 'react';
import { firestoreDB } from './firebaseConfig'; 

const carsArray = [
  { id: 'bmwx5', name: 'BMW X5', img: '/cars/bmwx5.jpg', transmission: 'Автомат', available: 5, price: 120, power: '340 к.с.', fuel: 'Бензин' },
  { id: 'audia6', name: 'Audi A6', img: '/cars/audia6.jpg', transmission: 'Автомат', available: 3, price: 70, power: '245 к.с.', fuel: 'Дизель' },
  { id: 'fordfocus', name: 'Ford Focus', img: '/cars/fordfocus.jpg', transmission: 'Механіка', available: 0, price: 35, power: '150 к.с.', fuel: 'Бензин' },
  { id: 'teslam3', name: 'Tesla Model 3', img: '/cars/teslam3.jpg', transmission: 'Автомат', available: 0, price: 150, power: '283 к.с.', fuel: 'Електро' },
  { id: 'mercedesc', name: 'Mercedes C-Class', img: '/cars/mercedesc.jpg', transmission: 'Автомат', available: 4, price: 90, power: '204 к.с.', fuel: 'Бензин' },
  { id: 'toyotacamry', name: 'Toyota Camry', img: '/cars/toyotacamry.jpg', transmission: 'Автомат', available: 6, price: 65, power: '181 к.с.', fuel: 'Бензин' },
  { id: 'hondacrv', name: 'Honda CR-V', img: '/cars/hondacrv.jpg', transmission: 'Автомат', available: 2, price: 80, power: '193 к.с.', fuel: 'Бензин' }
];

const UploadCarsToFirestore = () => {
  useEffect(() => {
    carsArray.forEach(async (car) => {
      try {
        await setDoc(doc(firestoreDB, 'cars', car.id), car); 
      } catch (err) {
        console.error('Помилка додавання:', err);
      }
    });
  }, []);
};

export default UploadCarsToFirestore;
