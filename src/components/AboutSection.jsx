import React from 'react';
import '../styles/AboutSection.css';

const AboutSection = () => {
  return (
    <section id="sobre" className="about-section">
      <div className="about-content">
        <div className="about-text">
          <h2>Sobre a Menina Dourada</h2>
          <p>
            Somos apaixonadas por sol, liberdade e moda praia que valoriza a beleza natural. 
            A Menina Dourada nasceu para inspirar mulheres que brilham com confiança e estilo.
            Cada peça é pensada com cuidado, conforto e autenticidade.
          </p>
          <p>
            Desde os tecidos até o acabamento, nossa missão é oferecer biquínis e acessórios que 
            unem qualidade, elegância e atitude em cada detalhe.
          </p>
        </div>
        <div className="about-image">
          <img
            src="https://images.unsplash.com/photo-1603262110263-3dd38046b350?auto=format&fit=crop&w=800&q=80"
            alt="Mulher na praia"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
