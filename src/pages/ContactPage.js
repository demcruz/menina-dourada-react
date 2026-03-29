import React, { useState } from 'react';
import './ContactPage.css';
import AdvancedSEO from '../seo/AdvancedSEO';
import { breadcrumbSchema } from '../seo/schema';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        assunto: '',
        mensagem: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simula envio
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitted(true);
            setFormData({ nome: '', email: '', assunto: '', mensagem: '' });
        }, 1500);
    };

    return (
        <div className="contact-page">
            <AdvancedSEO
                title="Contato | Menina Dourada"
                description="Fale com a equipe da Menina Dourada por WhatsApp ou formulário de contato. Atendimento rápido e personalizado."
                url="https://meninadourada.shop/contato"
                canonical="https://meninadourada.shop/contato"
                jsonLd={breadcrumbSchema([
                    { name: "Home", url: "https://meninadourada.shop/" },
                    { name: "Contato", url: "https://meninadourada.shop/contato" },
                ])}
            />
            {/* Hero Section */}
            <section className="contact-hero">
                <div className="contact-hero-content">
                    <h1 className="contact-title title-font">Fale Conosco</h1>
                    <p className="contact-subtitle">
                        Estamos aqui para te ajudar! Escolha a melhor forma de entrar em contato
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <div className="contact-container">
                
                {/* Cards de Contato Rápido */}
                <section className="contact-quick-section">
                    <div className="contact-cards two-cards">
                        <a href="https://wa.me/5521998043352?text=Olá! Gostaria de saber mais sobre os produtos da Menina Dourada" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="contact-card whatsapp-card">
                            <div className="card-icon">
                                <i className="fab fa-whatsapp"></i>
                            </div>
                            <h3>WhatsApp</h3>
                            <p className="card-highlight">(21) 99804-3352</p>
                            <p className="card-info">Resposta em até 2h</p>
                            <span className="card-badge">Mais rápido</span>
                        </a>

                        <a href="https://www.instagram.com/meninadouradaloja/" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="contact-card instagram-card">
                            <div className="card-icon">
                                <i className="fab fa-instagram"></i>
                            </div>
                            <h3>Instagram</h3>
                            <p className="card-highlight">@meninadouradaloja</p>
                            <p className="card-info">DM ou comentários</p>
                        </a>
                    </div>
                </section>

                {/* Formulário e Info */}
                <div className="contact-main-grid">
                    
                    {/* Formulário */}
                    <section className="contact-form-section">
                        <div className="form-header">
                            <h2 className="title-font">Envie sua mensagem</h2>
                            <p>Preencha o formulário abaixo e retornaremos o mais breve possível</p>
                        </div>

                        {submitted ? (
                            <div className="success-message">
                                <div className="success-icon">
                                    <i className="fas fa-check-circle"></i>
                                </div>
                                <h3>Mensagem enviada!</h3>
                                <p>Obrigada por entrar em contato. Responderemos em breve! 💛</p>
                                <button 
                                    className="new-message-btn"
                                    onClick={() => setSubmitted(false)}
                                >
                                    Enviar nova mensagem
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="nome">
                                            <i className="fas fa-user"></i>
                                            Nome
                                        </label>
                                        <input
                                            type="text"
                                            id="nome"
                                            name="nome"
                                            placeholder="Seu nome completo"
                                            value={formData.nome}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email">
                                            <i className="fas fa-envelope"></i>
                                            E-mail
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            placeholder="seu@email.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="assunto">
                                        <i className="fas fa-tag"></i>
                                        Assunto
                                    </label>
                                    <select
                                        id="assunto"
                                        name="assunto"
                                        value={formData.assunto}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Selecione um assunto</option>
                                        <option value="duvidas">💬 Dúvidas sobre produtos</option>
                                        <option value="tamanhos">📏 Ajuda com tamanhos</option>
                                        <option value="pedido">📦 Acompanhar pedido</option>
                                        <option value="trocas">🔄 Trocas e devoluções</option>
                                        <option value="pagamento">💳 Problemas com pagamento</option>
                                        <option value="parceria">🤝 Parcerias e colaborações</option>
                                        <option value="outros">✨ Outros assuntos</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="mensagem">
                                        <i className="fas fa-comment-alt"></i>
                                        Mensagem
                                    </label>
                                    <textarea
                                        id="mensagem"
                                        name="mensagem"
                                        placeholder="Como podemos te ajudar?"
                                        value={formData.mensagem}
                                        onChange={handleChange}
                                        rows="5"
                                        required
                                    ></textarea>
                                </div>

                                <button 
                                    type="submit" 
                                    className="submit-btn"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin"></i>
                                            Enviando...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-paper-plane"></i>
                                            Enviar Mensagem
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </section>

                    {/* Informações Laterais */}
                    <aside className="contact-info-section">
                        <div className="info-card">
                            <h3 className="title-font">Horário de Atendimento</h3>
                            <div className="schedule-list">
                                <div className="schedule-item">
                                    <span className="day">Segunda a Sexta</span>
                                    <span className="time">9h às 18h</span>
                                </div>
                                <div className="schedule-item">
                                    <span className="day">Sábado</span>
                                    <span className="time">9h às 14h</span>
                                </div>
                                <div className="schedule-item closed">
                                    <span className="day">Domingo</span>
                                    <span className="time">Fechado</span>
                                </div>
                            </div>
                        </div>

                        <div className="info-card">
                            <h3 className="title-font">Dúvidas Frequentes</h3>
                            <ul className="faq-list">
                                <li>
                                    <i className="fas fa-check-circle"></i>
                                    Entregamos para todo o Brasil
                                </li>
                                <li>
                                    <i className="fas fa-check-circle"></i>
                                    Frete grátis a partir de R$ 350
                                </li>
                                <li>
                                    <i className="fas fa-check-circle"></i>
                                    Troca garantida em 30 dias
                                </li>
                                <li>
                                    <i className="fas fa-check-circle"></i>
                                    Pagamento seguro via PIX
                                </li>
                            </ul>
                        </div>

                        <div className="info-card highlight-card">
                            <div className="highlight-icon">
                                <i className="fab fa-whatsapp"></i>
                            </div>
                            <h3>Atendimento VIP</h3>
                            <p>Precisa de ajuda urgente? Fale direto com nossa equipe!</p>
                            <a 
                                href="https://wa.me/5521998043352?text=Olá! Preciso de ajuda urgente" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="whatsapp-btn"
                            >
                                <i className="fab fa-whatsapp"></i>
                                Falar Agora
                            </a>
                        </div>
                    </aside>
                </div>

            </div>
        </div>
    );
};

export default ContactPage;
