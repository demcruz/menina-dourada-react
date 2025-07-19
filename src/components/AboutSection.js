// src/components/AboutSection.js
import React from 'react';

const AboutSection = () => {
    return (
        <section id="about" className="about-section"> {/* Substituído: py-16 bg-sand-100 */}
            <div className="container mx-auto px-4">
                <div className="about-content-wrapper md:flex-row items-center"> {/* Substituído: flex flex-col md:flex-row items-center */}
                    <div className="about-image-area md:w-1/2 md:pr-8"> {/* Substituído: md:w-1/2 mb-8 md:mb-0 md:pr-8 */}
                        <img
                            src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                            alt="Fundadora Menina Dourada"
                            className="about-image" /* Substituído: rounded-lg shadow-lg w-full */
                        />
                    </div>

                    <div className="about-text-area md:w-1/2 md:pl-8"> {/* Substituído: md:w-1/2 */}
                        <h2 className="section-title text-left">Nossa História</h2> {/* section-title reutilizado, mas alinhado à esquerda */}
                        <p className="about-text">Menina Dourada nasceu em 2018 da paixão de Camila pela moda praia e pelo desejo de criar peças que valorizassem a beleza da mulher brasileira.</p> {/* Substituído: mb-4 */}
                        <p className="about-text">Inspirada nos tons dourados do pôr do sol em sua cidade natal, Camila começou a confeccionar biquínis artesanais que rapidamente conquistaram admiradoras.</p> {/* Substituído: mb-4 */}
                        <p className="about-text">Hoje, somos uma marca reconhecida nacionalmente, mas mantemos o cuidado artesanal e a atenção aos detalhes que nos fizeram crescer.</p> {/* Substituído: mb-6 */}

                        <h3 className="about-subtitle">Nossa Missão</h3> {/* Substituído: title-font text-xl font-bold mb-3 */}
                        <p className="about-text">Empoderar mulheres através de peças que celebrem seus corpos e sua liberdade, ajudando cada uma a se sentir confiante e radiante.</p> {/* Substituído: mb-6 */}

                        <div className="about-values-grid md:space-x-4"> {/* Substituído: flex space-x-4 */}
                            <div className="value-card"> {/* Substituído: bg-white p-4 rounded-lg shadow-md text-center flex-1 */}
                                <i className="fas fa-tshirt value-icon"></i> {/* Substituído: text-3xl text-gold-600 mb-2 */}
                                <h4 className="value-title">Qualidade</h4> {/* Substituído: font-bold */}
                                <p className="value-description">Materiais premium e costura impecável</p> {/* Substituído: text-sm */}
                            </div>
                            <div className="value-card">
                                <i className="fas fa-heart value-icon"></i>
                                <h4 className="value-title">Amor</h4>
                                <p className="value-description">Feito com carinho para você</p>
                            </div>
                            <div className="value-card">
                                <i className="fas fa-leaf value-icon"></i>
                                <h4 className="value-title">Sustentabilidade</h4>
                                <p className="value-description">Produção consciente e responsável</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;