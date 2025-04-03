import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CarDetails.css';

const carData = {
  bmwx5: { name: 'BMW X5', img: '/cars/bmwx5.jpg', transmission: 'Автомат', power: '340 к.с.', fuel: 'Бензин', price: 120 },
  audia6: { name: 'Audi A6', img: '/cars/audia6.jpg', transmission: 'Автомат', power: '245 к.с.', fuel: 'Дизель', price: 70 },
  fordfocus: { name: 'Ford Focus', img: '/cars/fordfocus.jpg', transmission: 'Механіка', power: '150 к.с.', fuel: 'Бензин', price: 35 },
  teslam3: { name: 'Tesla Model 3', img: '/cars/teslam3.jpg', transmission: 'Автомат', power: '283 к.с.', fuel: 'Електро', price: 150 },
  mercedesc: { name: 'Mercedes C-Class', img: '/cars/mercedesc.jpg', transmission: 'Автомат', power: '204 к.с.', fuel: 'Бензин', price: 90 },
  toyotacamry: { name: 'Toyota Camry', img: '/cars/toyotacamry.jpg', transmission: 'Автомат', power: '181 к.с.', fuel: 'Бензин', price: 65 },
  hondacrv: { name: 'Honda CR-V', img: '/cars/hondacrv.jpg', transmission: 'Автомат', power: '193 к.с.', fuel: 'Бензин', price: 80 }
};

const CarDetails = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const car = carData[carId];

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [minDate, setMinDate] = useState('');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setMinDate(today);
  }, []);

  if (!car) {
    return <h2 style={{ textAlign: 'center', color: '#1e3a5f' }}>Автомобіль не знайдено!</h2>;
  }

  const handleBooking = () => {
    if (!startDate || !endDate) {
      alert('Будь ласка, оберіть дати оренди');
      return;
    }

    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.push({ carId, start: startDate, end: endDate, quantity });
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
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
        <button className="car-btn" onClick={handleBooking}>Підтвердити бронювання</button>
      </div>
    </section>
  );
}

export default CarDetails;