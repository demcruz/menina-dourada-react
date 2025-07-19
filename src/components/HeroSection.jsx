import React from 'react';
import '../styles/HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="hero-overlay">
        <div className="hero-content">
          <h1>Vista o verão com estilo</h1>
          <p>Sinta o sol, a liberdade e a beleza em cada detalhe</p>
          <a href="#produtos" className="hero-button">Ver Coleção</a>
        </div>
      </div>
    </section>
  );
};
export default HeroSection;
