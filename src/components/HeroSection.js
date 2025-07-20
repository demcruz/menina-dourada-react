
import React from 'react';


const HeroSection = () => {
  return (
    <section id="home" className="hero-section"> 
      <div className="hero-overlay"></div> 
      <div className="hero-content"> 
        <h1 className="hero-title md:text-6xl">Sinta o sol, vista a liberdade.</h1> 
        <p className="hero-subtitle">Coleção Verão 2025 - Biquínis que celebram seu corpo e sua confiança.</p> 
        <a href="/shop" className="hero-button">Confira nossa coleção</a> 
      </div>
    </section>
  );
};

export default HeroSection;