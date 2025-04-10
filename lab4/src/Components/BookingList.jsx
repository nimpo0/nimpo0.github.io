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
    const getCarData = async () => {
      const userBookings = JSON.parse(localStorage.getItem('bookings')) || [];
      const cars = {};

      for (const booking of userBookings) {
        const carId = booking.carId;
        if (!cars[carId]) {
          const car = doc(firestoreDB, 'cars', carId); 
          const carSnapshot = await getDoc(car);
          if (carSnapshot.exists()) {
            cars[carId] = carSnapshot.data();
          }
        }
      }
      
      setCarData(cars); 
    };

    const user = auth.currentUser;
    const userBookings = JSON.parse(localStorage.getItem('bookings')) || [];

    if (user) {
      const filteredBookings = userBookings.filter(booking => booking.userId === user.uid); 
      setBookings(filteredBookings);
    } else {
      setBookings([]); 
    }

    getCarData(); 
  }, [auth]);

  const cancelBooking = (index) => {
    if (!window.confirm('Ви впевнені, що хочете скасувати бронювання?')) return;
    
    const updatedBookings = [...bookings];
    updatedBookings.splice(index, 1);
    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
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
      {bookings.map((booking, i) => (
        <div key={i} className="booking-card">
          <img 
            src={`/cars/${booking.carId}.jpg`} 
            alt={carData[booking.carId] ? carData[booking.carId].name : booking.carId} 
          />
          <div className="booking-details">
            <h3>{carData[booking.carId] ? carData[booking.carId].name : booking.carId}</h3>
            <p><strong>Дати:</strong> {formatDate(booking.start)} - {formatDate(booking.end)}</p>
            <p><strong>Кількість авто:</strong> {booking.quantity}</p>
            <p><strong>Стан:</strong> Бронювання підтверджено!</p>
            <button className="cancel-btn" onClick={() => cancelBooking(i)}>Скасувати бронювання</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingsList;
