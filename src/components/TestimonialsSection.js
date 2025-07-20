



const TestimonialsSection = () => {
    return (
        <section className="testimonials-section"> 
            <div className="container"> 
                <h2 className="section-title">Depoimentos</h2> 

                <div className="testimonials-grid md:grid-cols-3"> 
                    
                    <div className="testimonial-card"> 
                        <div className="testimonial-stars"> 
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                        </div>
                        <p className="testimonial-text">"Os biquínis da Menina Dourada são incríveis! O caimento é perfeito e o material é de alta qualidade. Me sinto linda e confiante!"</p> 
                        <div className="testimonial-author-info"> 
                            <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="Ana Clara" className="author-image" />
                            <div>
                                <p className="author-name">Ana Clara</p> 
                                <p className="author-location">São Paulo</p> 
                            </div>
                        </div>
                    </div>

                
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

                 
                    <div className="testimonial-card">
                        <div className="testimonial-stars">
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star-half-alt"></i> 
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