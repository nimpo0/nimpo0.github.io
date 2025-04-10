import React from 'react';

const CompanyInfo = () => {
  return (
    <section id="about">
      <div className="container">
        <h2>Про нас</h2>
        <p>Наша компанія спеціалізується на оренді автомобілів для будь-яких потреб. Ми пропонуємо широкий вибір сучасних та надійних авто, які відповідають високим стандартам якості та безпеки. Наш автопарк складається з різноманітних моделей — від економ класу до преміум класу, щоб задовольнити різні запити наших клієнтів. Усі автомобілі регулярно проходять технічний огляд і обслуговування, що гарантує їхню безпеку та комфорт під час поїздок.</p>
        <p>Ми прагнемо забезпечити наших клієнтів найкращим сервісом, тому ми пропонуємо зручні умови оренди, гнучкі тарифи та оперативну підтримку. Незалежно від того, чи вам потрібен автомобіль для подорожі, бізнесу чи святкової події — ми завжди готові допомогти знайти ідеальний варіант.</p>
        <p>Контакти: <a href="tel:+380123456789">+380123456789</a></p>
        <div className="map">
          <h3>Карта офісу</h3>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3118.6509652730647!2d23.999493280430226!3d49.8440546642714!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x473add9bab2783e1%3A0x432c5b328c28e410!2z0LLRg9C70LjRhtGPINCv0YHQvdCwLCAxNiwg0JvRjNCy0ZbQsiwg0JvRjNCy0ZbQstGB0YzQutCwINC-0LHQu9Cw0YHRgtGMLCA3OTAwMA!5e0!3m2!1suk!2sua!4v1741452067455!5m2!1suk!2sua"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="map"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default CompanyInfo;
