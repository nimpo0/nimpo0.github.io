import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; 
import { firestoreDB } from '../firebase/firebaseConfig'; 
import '../App.css';

function formatDate(dateStr) {
  if (!dateStr) return 'Невідомо';
  const [yyyy, mm, dd] = dateStr.split('-');
  return `${dd}.${mm}.${yyyy}`;
}

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [carData, setCarData] = useState({}); 
  const auth = getAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        alert('Немає токена — користувач неавторизований');
        return;
      }

      try {
        const response = await fetch(`https://orenda-avto-server.onrender.com/api/bookings`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        const text = await response.text();
        const fetchedBookings = JSON.parse(text);
        setBookings(fetchedBookings);

        const cars = {};
        for (const booking of fetchedBookings) {
          const carId = booking.carId;
          if (!cars[carId]) {
            const carRef = doc(firestoreDB, 'cars', carId);
            const carSnapshot = await getDoc(carRef);
            if (carSnapshot.exists()) {
              cars[carId] = carSnapshot.data();
          }
        }
      }

      setCarData(cars);
    } catch (error) {
      alert('Помилка при завантаженні бронювань:', error);
    }
    };
    fetchBookings();
  }, [auth]);

  const cancelBooking = async (bookingId) => {
    if (!window.confirm('Ви впевнені, що хочете скасувати бронювання?')) return;
  
    const token = localStorage.getItem('token');
  
    try {
      const response = await fetch(`https://orenda-avto-server.onrender.com/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Не вдалося скасувати бронювання');
      }
  
      setBookings(prev => prev.filter(booking => booking.id !== bookingId));
    } catch (error) {
      alert('Не вдалося скасувати бронювання.');
    }
  };
  

  if (bookings.length === 0) {
    return (
      <p style={{ 
        fontSize: '28px', 
        fontWeight: 'bold', 
        textAlign: 'center',
        color: '#1e3a5f',
        marginTop: '40px'
      }}>
        Наразі немає бронювань.
      </p>
    );
  }

  return (
    <div id="booking-list">
      {bookings.map((booking) => (
        <div key={booking.id} className="booking-card">
          <img 
            src={`/cars/${booking.carId}.jpg`} 
            alt={carData[booking.carId] ? carData[booking.carId].name : 'Автомобіль'} 
          />
          <div className="booking-details">
            <h3>{carData[booking.carId] ? carData[booking.carId].name : 'Невідомий автомобіль'}</h3>
            <p><strong>Дати:</strong> {formatDate(booking.startDate)} - {formatDate(booking.endDate)}</p>
            <p><strong>Кількість авто:</strong> {booking.quantity}</p>
            <p><strong>Стан:</strong> Бронювання підтверджено!</p>
            <button className="cancel-btn" onClick={() => cancelBooking(booking.id)}>Скасувати бронювання</button>
          </div>
        </div>
      ))}
    </div>
  );  
};

export default BookingsList;
