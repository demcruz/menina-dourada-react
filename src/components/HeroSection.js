
import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section id="home" className="hero-section"> 
      <div className="hero-overlay"></div> 
      <div className="hero-content"> 
        <h1 className="hero-title">Desperte sua Deusa Interior</h1> 
        <p className="hero-subtitle">Biquínis exclusivos que realçam suas curvas e elevam sua autoestima. Sinta-se irresistível neste verão!</p> 
        <div className="hero-cta-container">
          <Link to="/shop" className="hero-button-primary">Ver Coleção 2025</Link>
          <p className="hero-trust-signal">🚚 Frete grátis acima de R$ 200 | 💎 Qualidade premium</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;