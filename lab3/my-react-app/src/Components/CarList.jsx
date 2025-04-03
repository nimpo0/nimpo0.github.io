import React, { useState } from 'react';
import CarCard from './CarCard';

const CarsList = () => {
  const carsArray = [
    { id: 'bmwx5', name: 'BMW X5', img: '/cars/bmwx5.jpg', transmission: 'Автомат', available: 5, price: 120 },
    { id: 'audia6', name: 'Audi A6', img: '/cars/audia6.jpg', transmission: 'Автомат', available: 3, price: 70 },
    { id: 'fordfocus', name: 'Ford Focus', img: '/cars/fordfocus.jpg', transmission: 'Механіка', available: 0, price: 35 },
    { id: 'teslam3', name: 'Tesla Model 3', img: '/cars/teslam3.jpg', transmission: 'Автомат', available: 0, price: 150 },
    { id: 'mercedesc', name: 'Mercedes C-Class', img: '/cars/mercedesc.jpg', transmission: 'Автомат', available: 4, price: 90 },
    { id: 'toyotacamry', name: 'Toyota Camry', img: '/cars/toyotacamry.jpg', transmission: 'Автомат', available: 6, price: 65 },
    { id: 'hondacrv', name: 'Honda CR-V', img: '/cars/hondacrv.jpg', transmission: 'Автомат', available: 2, price: 80 }
  ];

  const [filters, setFilters] = useState({ 
    price: '',
    transmission: '',
    available: ''
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({ price: '', transmission: '', available: '' });
  };

  const filteredCars = carsArray.filter(car => {
    const priceMatch = filters.price ? car.price <= parseInt(filters.price) : true;
    const transmissionMatch = filters.transmission ? car.transmission === filters.transmission : true;
    const availableMatch = filters.available ? car.available === parseInt(filters.available) : true;
    return priceMatch && transmissionMatch && availableMatch;
  });

  return (
    <section className="cars-section">
      <h2>Наш автопарк</h2>
      
      {/* ФІЛЬТРИ */}
      <div className="filters-container">
        <h3>Фільтри</h3>
        <div className="filters-grid">
          <div>
            <label>Ціна до:</label>
            <select name="price" value={filters.price} onChange={handleFilterChange} className="filter-select">
              <option value="">Будь-яка</option>
              <option value="50">до $50</option>
              <option value="80">до $80</option>
              <option value="100">до $100</option>
              <option value="150">до $150</option>
            </select>
          </div>
          <div>
            <label>Трансмісія:</label>
            <select name="transmission" value={filters.transmission} onChange={handleFilterChange} className="filter-select">
              <option value="">Будь-яка</option>
              <option value="Автомат">Автомат</option>
              <option value="Механіка">Механіка</option>
            </select>
          </div>
          <div>
            <label>Наявність:</label>
            <select name="available" value={filters.available} onChange={handleFilterChange} className="filter-select">
              <option value="">Будь-яка</option>
              <option value="0">0 авто</option>
              <option value="1">1 авто</option>
              <option value="2">2 авто</option>
              <option value="3">3 авто</option>
              <option value="4">4 авто</option>
              <option value="5">5 авто</option>
              <option value="6">6 авто</option>
            </select>
          </div>
        </div>
        <button onClick={resetFilters} className="reset-btn">Скинути фільтри</button>
      </div>

      {filteredCars.length > 0 ? (
        <div className="grid-container">
          {filteredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
        <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e3a5f', marginTop: '40px', textAlign: 'center' }}>
          Автомобілі не знайдені за обраними фільтрами.
        </p>
      )}
    </section>
  );
};

export default CarsList;
