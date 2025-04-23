import React from 'react';
import { useNavigate } from 'react-router-dom';

const CarCard = ({ car }) => {
  const navigate = useNavigate(); 

  return (
    <div className={`car-card ${car.available === 0 ? 'unavailable' : ''}`}>
      <img src={car.img} alt={car.name} />
      <h3>{car.name}</h3>
      <p className="car-details">
        Трансмісія: {car.transmission} | Доступно: {car.available}
      </p>
      <p className="car-price">${car.price}/доба</p>
      {car.available > 0 ? (
        <button
          className="details-btn"
          onClick={() => navigate(`/car/${car.id}`)} 
        >
          Забронювати
        </button>
      ) : (
        <button className="disabled-btn" disabled>
          Недоступно
        </button>
      )}
    </div>
  );
};

export default CarCard;
