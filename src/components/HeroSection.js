// src/components/HeroSection.js
import React from 'react';
// Não precisa importar index.css aqui de novo se já está em App.js ou index.js
// Mas se quiser garantir, pode adicionar: import '../index.css';

const HeroSection = () => {
  return (
    <section id="home" className="hero-section"> {/* Substituído: hero-image h-screen flex items-center justify-center text-center relative */}
      <div className="hero-overlay"></div> {/* Substituído: absolute inset-0 bg-white opacity-20 */}
      <div className="hero-content"> {/* Substituído: relative z-10 px-4 max-w-4xl mx-auto fade-in */}
        <h1 className="hero-title md:text-6xl">Sinta o sol, vista a liberdade.</h1> {/* Substituído: title-font text-4xl md:text-6xl font-bold text-white mb-6 */}
        <p className="hero-subtitle">Coleção Verão 2025 - Biquínis que celebram seu corpo e sua confiança.</p> {/* Substituído: text-xl text-white mb-8 */}
        <a href="/shop" className="hero-button">Comprar agora</a> {/* Substituído: bg-gold-600 hover:bg-gold-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 inline-block */}
      </div>
    </section>
  );
};

export default HeroSection;