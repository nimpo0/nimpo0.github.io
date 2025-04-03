import { useEffect, useState } from 'react';
import '../App.css';

const carNames = {
  bmwx5: 'BMW X5',
  audia6: 'Audi A6',
  fordfocus: 'Ford Focus',
  teslam3: 'Tesla Model 3',
  mercedesc: 'Mercedes C-Class',
  toyotacamry: 'Toyota Camry',
  hondacrv: 'Honda CR-V'
};

function formatDate(dateStr) {
  if (!dateStr) return 'Невідомо';
  const [yyyy, mm, dd] = dateStr.split('-');
  return `${dd}.${mm}.${yyyy}`;
}
const BookingsList = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('bookings')) || [];
    setBookings(saved);
  }, []);

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
          <img src={`/cars/${booking.carId}.jpg`} alt={carNames[booking.carId] || booking.carId} />
          <div className="booking-details">
            <h3>{carNames[booking.carId] || booking.carId}</h3>
            <p><strong>Дати:</strong> {formatDate(booking.start)} - {formatDate(booking.end)}</p>
            <p><strong>Кількість авто:</strong> {booking.quantity}</p>
            <p><strong>Стан:</strong> Бронювання підтверджено!</p>
            <button className="cancel-btn" onClick={() => cancelBooking(i)}>Скасувати бронювання</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BookingsList;