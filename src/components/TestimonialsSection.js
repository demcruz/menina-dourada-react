// src/components/TestimonialsSection.js
import React from 'react';
// Importe '../index.css' se não estiver já importado em App.js ou index.js
// import '../index.css';

const TestimonialsSection = () => {
    return (
        <section className="testimonials-section"> {/* Substituído: py-16 bg-sand-100 */}
            <div className="container"> {/* mx-auto px-4 já estão no .container */}
                <h2 className="section-title">Depoimentos</h2> {/* section-title já definido */}

                <div className="testimonials-grid md:grid-cols-3"> {/* Substituído: grid grid-cols-1 md:grid-cols-3 gap-8 */}
                    {/* Depoimento 1 */}
                    <div className="testimonial-card"> {/* Substituído: bg-white p-6 rounded-lg shadow-md */}
                        <div className="testimonial-stars"> {/* Substituído: flex items-center mb-4 */}
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                        </div>
                        <p className="testimonial-text">"Os biquínis da Menina Dourada são incríveis! O caimento é perfeito e o material é de alta qualidade. Me sinto linda e confiante!"</p> {/* Substituído: mb-4 italic */}
                        <div className="testimonial-author-info"> {/* Substituído: flex items-center */}
                            <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="Ana Clara" className="author-image" /> {/* Substituído: w-10 h-10 rounded-full mr-3 */}
                            <div>
                                <p className="author-name">Ana Clara</p> {/* Substituído: font-medium */}
                                <p className="author-location">São Paulo</p> {/* Substituído: text-sm text-sand-500 */}
                            </div>
                        </div>
                    </div>

                    {/* Depoimento 2 */}
                    <div className="testimonial-card">
                        <div className="testimonial-stars">
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                        </div>
                        <p className="testimonial-text">"Comprei vários modelos e amo todos! O atendimento é excelente e o produto chega super rápido. Já indiquei para todas minhas amigas!"</p>
                        <div className="testimonial-author-info">
                            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Juliana" className="author-image" />
                            <div>
                                <p className="author-name">Juliana</p>
                                <p className="author-location">Rio de Janeiro</p>
                            </div>
                        </div>
                    </div>

                    {/* Depoimento 3 */}
                    <div className="testimonial-card">
                        <div className="testimonial-stars">
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star-half-alt"></i> {/* Meia estrela */}
                        </div>
                        <p className="testimonial-text">"Finalmente encontrei biquínis que valorizam meu corpo! As estampas são lindas e o material não desbota mesmo depois de muitos usos."</p>
                        <div className="testimonial-author-info">
                            <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Fernanda" className="author-image" />
                            <div>
                                <p className="author-name">Fernanda</p>
                                <p className="author-location">Salvador</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;