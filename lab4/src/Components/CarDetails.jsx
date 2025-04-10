import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { firestoreDB } from '../firebase/firebaseConfig';
import './CarDetails.css';

const CarDetails = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const auth = getAuth();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [minDate, setMinDate] = useState('');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setMinDate(today);
  }, []);

  useEffect(() => {
    const getCar = async () => {
      try {
        const car = doc(firestoreDB, 'cars', carId); 
        const carSnapshot = await getDoc(car);

        if (carSnapshot.exists()) {
          setCar(carSnapshot.data());
        } else {
          setCar(null);
        }
      } catch (error) {
        console.error('Помилка при завантаженні авто:', error);
      } finally {
        setLoading(false);
      }
    };

    getCar();
  }, [carId]);

  if (loading) return <h2 style={{ textAlign: 'center', color: '#1e3a5f' }}>Завантаження...</h2>;
  if (!car) return <h2 style={{ textAlign: 'center', color: '#1e3a5f' }}>Автомобіль не знайдено!</h2>;

  const handleBooking = () => {
    const user = auth.currentUser;
    if (!user) {
      alert('Ви повинні бути авторизованим у системі для бронювання!');
      return;
    }

    if (!startDate || !endDate) {
      alert('Будь ласка, оберіть дати оренди');
      return;
    }

    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.push({carId, start: startDate, end: endDate, quantity, userId: user.uid});
    localStorage.setItem('bookings', JSON.stringify(bookings));
    alert('Авто додано до бронювання!');
    navigate('/bookings');
  };

  const handleStartDateChange = (e) => {
    const selectedStartDate = e.target.value;
    setStartDate(selectedStartDate);
    if (endDate && endDate < selectedStartDate) {
      setEndDate('');
    }
  };

  const handleEndDateChange = (e) => {
    const selectedEndDate = e.target.value;
    setEndDate(selectedEndDate);
    if (selectedEndDate < startDate) {
      alert('Дата закінчення не може бути до дати початку');
      setEndDate('');
    }
  };

  return (
    <section className="container">
      <div className="car-details-container">
        <div className="car-details-content">
          <img className="car-img" src={car.img} alt={car.name} />
          <div className="car-info">
            <h2>{car.name}</h2>
            <p><strong>Трансмісія:</strong> {car.transmission}</p>
            <p><strong>Потужність:</strong> {car.power}</p>
            <p><strong>Тип палива:</strong> {car.fuel}</p>
            <p className="car-price"><strong>Ціна:</strong> ${car.price}/доба</p>
          </div>
        </div>
        <div className="car-form">
          <h3>Виберіть дати оренди:</h3>
          <label>Дата початку:</label>
          <input
            type="date"
            min={minDate}
            value={startDate}
            onChange={handleStartDateChange}
          />
          <label>Дата закінчення:</label>
          <input
            type="date"
            min={startDate || minDate}
            value={endDate}
            onChange={handleEndDateChange}
          />
          <label>Кількість авто:</label>
          <select value={quantity} onChange={(e) => setQuantity(e.target.value)}>
            {[...Array(car.available).keys()].map((i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </div>
        <button className="car-btn" onClick={handleBooking}>Підтвердити бронювання</button>
      </div>
    </section>
  );
};

export default CarDetails;
