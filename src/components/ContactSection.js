import React from 'react';

const ContactSection = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Mensagem enviada! Em breve entraremos em contato.');
        e.target.reset();
    };

    return (
        <section id="contact" className="contact-section">
            <div className="container mx-auto px-4">
                <h2 className="section-title">Fale Conosco</h2>

                <div className="contact-content-wrapper md:flex-row">
                    
                    <div className="contact-form-area md:w-1/2 md:pr-8">
                        <div className="contact-form-header">
                            <h3 className="contact-form-title">Envie sua mensagem</h3>
                            <p className="contact-form-subtitle">Respondemos em até 2 horas</p>
                        </div>
                        
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="name" className="form-field-label">Nome*</label>
                                <input type="text" id="name" name="name" className="w-full" required />
                            </div>

                            <div>
                                <label htmlFor="email" className="form-field-label">E-mail*</label>
                                <input type="email" id="email" name="email" className="w-full" required />
                            </div>

                            <div>
                                <label htmlFor="subject" className="form-field-label">Como podemos ajudar?</label>
                                <select id="subject" name="subject" className="w-full">
                                    <option value="">Selecione um assunto</option>
                                    <option value="duvidas">Dúvidas sobre produtos</option>
                                    <option value="tamanhos">Tabela de tamanhos</option>
                                    <option value="pedidos">Status do pedido</option>
                                    <option value="trocas">Trocas e devoluções</option>
                                    <option value="outros">Outros</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="message" className="form-field-label">Mensagem*</label>
                                <textarea id="message" name="message" rows="4" className="w-full" placeholder="Conte-nos como podemos ajudar..." required></textarea>
                            </div>

                            <button type="submit" className="contact-submit-button">
                                Enviar Mensagem
                            </button>
                        </form>
                    </div>

                    <div className="contact-whatsapp-area md:w-1/2 md:pl-8">
                        <div className="whatsapp-card">
                            <div className="whatsapp-header">
                                <i className="fab fa-whatsapp whatsapp-icon"></i>
                                <h3 className="whatsapp-title">Atendimento Rápido</h3>
                            </div>
                            
                            <div className="whatsapp-content">
                                <p className="whatsapp-subtitle">Prefere falar direto conosco?</p>
                                <p className="whatsapp-phone">(21) 99804-3354</p>
                                <p className="whatsapp-hours">📱 Seg a Sex: 9h às 18h<br/>📱 Sáb: 9h às 14h</p>
                                
                                <a href="https://wa.me/5521998043354?text=Olá! Gostaria de saber mais sobre os biquínis da Menina Dourada" 
                                   className="whatsapp-button" 
                                   target="_blank" 
                                   rel="noopener noreferrer">
                                    <i className="fab fa-whatsapp"></i>
                                    Falar no WhatsApp
                                </a>
                                
                                <div className="contact-benefits">
                                    <p className="benefit-item">✅ Resposta imediata</p>
                                    <p className="benefit-item">✅ Tire dúvidas sobre tamanhos</p>
                                    <p className="benefit-item">✅ Acompanhe seu pedido</p>
                                </div>
                            </div>
                        </div>
                    </div>
                   
                </div>
            </div>
        </section>
    );
};

export default ContactSection;