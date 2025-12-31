import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './ContactWidget.css';

const ContactWidget = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);
    const [isOverProducts, setIsOverProducts] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const isCheckoutRoute = location.pathname.startsWith('/checkout');
    const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'email'
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        telefone: '',
        assunto: '',
        mensagem: '',
        aceitePrivacidade: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const toggleWidget = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setActiveTab('chat');
            setSubmitSuccess(false);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setHasScrolled(window.scrollY > 120);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (!('matchMedia' in window)) return;
        const media = window.matchMedia('(max-width: 767px)');
        const updateMatch = () => setIsMobile(media.matches);
        updateMatch();

        if (typeof media.addEventListener === 'function') {
            media.addEventListener('change', updateMatch);
            return () => media.removeEventListener('change', updateMatch);
        }

        media.addListener(updateMatch);
        return () => media.removeListener(updateMatch);
    }, []);

    useEffect(() => {
        const target = document.querySelector('#shop');
        if (!target) return;

        const handleVisibilityCheck = () => {
            const rect = target.getBoundingClientRect();
            const viewportHeight = window.innerHeight || 0;
            const isVisible =
                rect.top < viewportHeight * 0.7 &&
                rect.bottom > viewportHeight * 0.2;
            setIsOverProducts(isVisible);
        };

        handleVisibilityCheck();
        window.addEventListener('scroll', handleVisibilityCheck, { passive: true });
        window.addEventListener('resize', handleVisibilityCheck);
        return () => {
            window.removeEventListener('scroll', handleVisibilityCheck);
            window.removeEventListener('resize', handleVisibilityCheck);
        };
    }, []);

    const handleWhatsApp = () => {
        window.open('https://wa.me/5521998043352?text=Olá! Gostaria de mais informações.', '_blank');
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        if (!formData.aceitePrivacidade) {
            alert('Por favor, aceite a Política de Privacidade para continuar.');
            return;
        }
        
        setIsSubmitting(true);
        
        // Simula envio (aqui você pode integrar com seu backend)
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitSuccess(true);
            setFormData({
                nome: '',
                email: '',
                telefone: '',
                assunto: '',
                mensagem: '',
                aceitePrivacidade: false
            });
        }, 1500);
    };

    const closeWidget = () => {
        setIsOpen(false);
        setSubmitSuccess(false);
    };

    if (isCheckoutRoute) return null;

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div 
                    className="contact-widget-overlay" 
                    onClick={closeWidget}
                />
            )}

            {/* Widget Panel */}
            <div className={`contact-widget-panel ${isOpen ? 'open' : ''} ${activeTab === 'email' ? 'email-mode' : ''}`}>
                {/* Header */}
                <div className="contact-widget-header">
                    <h2>Fale conosco</h2>
                    <button 
                        className="contact-header-close"
                        onClick={closeWidget}
                        aria-label="Fechar"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                {/* Content based on active tab */}
                {activeTab === 'chat' ? (
                    <div className="contact-widget-options">
                        <p className="contact-intro">Olá! Preencha o formulário ou inicie um chat.</p>
                        
                        {/* WhatsApp */}
                        <button className="contact-option" onClick={handleWhatsApp}>
                            <div className="contact-option-icon whatsapp">
                                <i className="fab fa-whatsapp"></i>
                            </div>
                            <div className="contact-option-text">
                                <strong>Enviar mensagem</strong>
                                <span>Iniciar chat no WhatsApp</span>
                            </div>
                            <i className="fas fa-chevron-right contact-option-arrow"></i>
                        </button>

                        {/* Telefone */}
                        <div className="contact-option contact-option-info">
                            <div className="contact-option-icon phone">
                                <i className="fas fa-phone-alt"></i>
                            </div>
                            <div className="contact-option-text">
                                <strong>Fale conosco</strong>
                                <span>Segunda a Sexta: 9h às 18h</span>
                                <span className="contact-phone">(21) 99804-3352</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="contact-email-form">
                        {submitSuccess ? (
                            <div className="contact-success">
                                <div className="contact-success-icon">
                                    <i className="fas fa-check-circle"></i>
                                </div>
                                <h3>Mensagem enviada!</h3>
                                <p>Retornaremos seu e-mail em breve.</p>
                                <button 
                                    className="contact-success-btn"
                                    onClick={() => setSubmitSuccess(false)}
                                >
                                    Enviar outra mensagem
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleEmailSubmit}>
                                <p className="contact-form-intro">
                                    Olá! Preencha o formulário e retornaremos seu e-mail!
                                </p>

                                <div className="contact-form-group">
                                    <input
                                        type="text"
                                        name="nome"
                                        placeholder="Digite seu nome*"
                                        value={formData.nome}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="contact-form-group">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Digite seu e-mail*"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="contact-form-group">
                                    <input
                                        type="tel"
                                        name="telefone"
                                        placeholder="Digite seu telefone..."
                                        value={formData.telefone}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="contact-form-group">
                                    <select
                                        name="assunto"
                                        value={formData.assunto}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Assunto*</option>
                                        <option value="duvida">Dúvida sobre produto</option>
                                        <option value="pedido">Informações sobre pedido</option>
                                        <option value="troca">Troca ou devolução</option>
                                        <option value="outro">Outro assunto</option>
                                    </select>
                                </div>

                                <div className="contact-form-group">
                                    <textarea
                                        name="mensagem"
                                        placeholder="Digite aqui sua mensagem*"
                                        rows="4"
                                        value={formData.mensagem}
                                        onChange={handleInputChange}
                                        required
                                    ></textarea>
                                </div>

                                <div className="contact-form-checkbox">
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="aceitePrivacidade"
                                            checked={formData.aceitePrivacidade}
                                            onChange={handleInputChange}
                                        />
                                        <span>Aceito a <a href="/politica-privacidade" target="_blank" rel="noopener noreferrer">Política de Privacidade</a> *</span>
                                    </label>
                                </div>

                                <div className="contact-form-footer">
                                    <span className="contact-form-required">* Campos de preenchimento obrigatório</span>
                                    <button 
                                        type="submit" 
                                        className="contact-form-submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Enviando...' : 'ENVIAR'}
                                    </button>
                                </div>

                                <p className="contact-form-hours">
                                    Atendimento de segunda a sexta-feira, das 09h às 18h, exceto feriados.
                                </p>
                            </form>
                        )}
                    </div>
                )}

                {/* Bottom Navigation */}
                <div className="contact-widget-nav">
                    <button 
                        className={`contact-nav-item ${activeTab === 'chat' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('chat'); setSubmitSuccess(false); }}
                    >
                        <i className="fas fa-comment-dots"></i>
                        <span>Chat</span>
                    </button>
                    <button 
                        className={`contact-nav-item ${activeTab === 'email' ? 'active' : ''}`}
                        onClick={() => setActiveTab('email')}
                    >
                        <i className="fas fa-envelope"></i>
                        <span>E-mail</span>
                    </button>
                </div>
            </div>

            {/* Floating Button */}
            <button 
                className={`contact-widget-button ${isOpen ? 'active' : ''} ${isMobile && !isOpen && (!hasScrolled || isOverProducts) ? 'is-hidden' : ''}`}
                onClick={toggleWidget}
                aria-label={isOpen ? 'Fechar contato' : 'Abrir contato'}
            >
                {isOpen ? (
                    <i className="fas fa-times"></i>
                ) : (
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17L2.5 21.5L7 20.6622C8.47087 21.513 10.1786 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 12H8.01M12 12H12.01M16 12H16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                )}
            </button>
        </>
    );
};

export default ContactWidget;
