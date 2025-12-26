import React from 'react';

const AboutSection = () => {
    return (
        <section id="about" className="about-section">
            <div className="container mx-auto px-4">
                <div className="about-content-wrapper md:flex-row items-center">
                    <div className="about-image-area md:w-1/2 md:pr-8">
                        <img
                            src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                            alt="Fundadora Menina Dourada"
                            className="about-image"
                        />
                    </div>

                    <div className="about-text-area md:w-1/2 md:pl-8">
                        <h2 className="section-title text-left">Nossa História</h2>
                        
                        <div className="about-story">
                            <p className="about-text-highlight">
                                <strong>Desde 2018</strong> criamos biquínis que celebram a beleza única de cada mulher brasileira.
                            </p>
                            
                            <p className="about-text">
                                Inspirada nos tons dourados do pôr do sol, nossa fundadora Weryka começou com peças artesanais que rapidamente conquistaram o coração das clientes.
                            </p>
                            
                            <p className="about-text">
                                Hoje somos reconhecidas nacionalmente, mas mantemos o cuidado artesanal que nos fez crescer.
                            </p>
                        </div>

                        <div className="about-mission">
                            <h3 className="about-subtitle">Por que escolher Menina Dourada?</h3>
                            <p className="about-text-benefit">
                                ✨ Peças que realçam sua confiança e liberdade<br/>
                                🏆 Qualidade premium com acabamento impecável<br/>
                                💛 Feito com amor para você se sentir radiante
                            </p>
                        </div>

                        <div className="about-values-grid md:space-x-4">
                            <div className="value-card">
                                <i className="fas fa-award value-icon"></i>
                                <h4 className="value-title">Premium</h4>
                                <p className="value-description">Materiais selecionados</p>
                            </div>
                            <div className="value-card">
                                <i className="fas fa-heart value-icon"></i>
                                <h4 className="value-title">Confiança</h4>
                                <p className="value-description">Realça sua beleza</p>
                            </div>
                            <div className="value-card">
                                <i className="fas fa-shipping-fast value-icon"></i>
                                <h4 className="value-title">Entrega</h4>
                                <p className="value-description">Rápida e segura</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;