import React from 'react';
import '../styles/TestimonialsSection.css';

import testimonials from '../data/testimonials';


function TestimonialsSection() {
  return (
    <section className="testimonials-section">
      <h2>Depoimentos</h2>
      <div className="testimonials-grid">
        {testimonials.map((t, index) => (
          <div key={index} className="testimonial-card">
            <div className="testimonial-header">
              <img src={t.avatar} alt={t.name} />
              <div>
                <h4>{t.name}</h4>
                <p>{t.city}</p>
              </div>
            </div>
            <p className="testimonial-message">"{t.message}"</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TestimonialsSection;
