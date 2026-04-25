import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import './ContactWidget.css';

// SVG icons inline — substituem Font Awesome
const TimesIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
);
const WhatsAppSvg = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
);
const PhoneIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
);
const ChevronRight = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6"/>
    </svg>
);
const ChatIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
);
const MailIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
);
const CheckCircle = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
);

const ContactWidget = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);
    const [isOverProducts, setIsOverProducts] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const isCheckoutRoute = location.pathname.startsWith('/checkout');
    const [activeTab, setActiveTab] = useState('chat');
    const [formData, setFormData] = useState({
        nome: '', email: '', telefone: '', assunto: '', mensagem: '', aceitePrivacidade: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const scrolledRef = useRef(false);

    const toggleWidget = () => {
        setIsOpen(!isOpen);
        if (!isOpen) { setActiveTab('chat'); setSubmitSuccess(false); }
    };

    // Scroll detection — throttled via ref comparison (P11: avoid forced reflow)
    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY > 120;
            if (scrolled !== scrolledRef.current) {
                scrolledRef.current = scrolled;
                setHasScrolled(scrolled);
            }
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

    // P11: Use IntersectionObserver instead of scroll + getBoundingClientRect
    useEffect(() => {
        const target = document.querySelector('#shop');
        if (!target || typeof IntersectionObserver === 'undefined') return;

        const observer = new IntersectionObserver(
            ([entry]) => setIsOverProducts(entry.isIntersecting),
            { threshold: 0.1 }
        );
        observer.observe(target);
        return () => observer.disconnect();
    }, []);

    const handleWhatsApp = () => {
        window.open('https://wa.me/5521973137347?text=Olá! Gostaria de mais informações.', '_blank');
    };

    const handleInputChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }, []);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        if (!formData.aceitePrivacidade) {
            alert('Por favor, aceite a Política de Privacidade para continuar.');
            return;
        }
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitSuccess(true);
            setFormData({ nome: '', email: '', telefone: '', assunto: '', mensagem: '', aceitePrivacidade: false });
        }, 1500);
    };

    const closeWidget = () => { setIsOpen(false); setSubmitSuccess(false); };

    if (isCheckoutRoute) return null;

    return (
        <>
            {isOpen && <div className="contact-widget-overlay" onClick={closeWidget} />}

            <div className={`contact-widget-panel ${isOpen ? 'open' : ''} ${activeTab === 'email' ? 'email-mode' : ''}`}>
                <div className="contact-widget-header">
                    <h2>Fale conosco</h2>
                    <button className="contact-header-close" onClick={closeWidget} aria-label="Fechar"><TimesIcon /></button>
                </div>

                {activeTab === 'chat' ? (
                    <div className="contact-widget-options">
                        <p className="contact-intro">Olá! Preencha o formulário ou inicie um chat.</p>
                        <button className="contact-option" onClick={handleWhatsApp}>
                            <div className="contact-option-icon whatsapp"><WhatsAppSvg /></div>
                            <div className="contact-option-text">
                                <strong>Enviar mensagem</strong>
                                <span>Iniciar chat no WhatsApp</span>
                            </div>
                            <ChevronRight />
                        </button>
                        <div className="contact-option contact-option-info">
                            <div className="contact-option-icon phone"><PhoneIcon /></div>
                            <div className="contact-option-text">
                                <strong>Fale conosco</strong>
                                <span>Segunda a Sexta: 9h às 18h</span>
                                <span className="contact-phone">(21) 97313-7347</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="contact-email-form">
                        {submitSuccess ? (
                            <div className="contact-success">
                                <div className="contact-success-icon"><CheckCircle /></div>
                                <h3>Mensagem enviada!</h3>
                                <p>Retornaremos seu e-mail em breve.</p>
                                <button className="contact-success-btn" onClick={() => setSubmitSuccess(false)}>Enviar outra mensagem</button>
                            </div>
                        ) : (
                            <form onSubmit={handleEmailSubmit}>
                                <p className="contact-form-intro">Olá! Preencha o formulário e retornaremos seu e-mail!</p>
                                <div className="contact-form-group"><input type="text" name="nome" placeholder="Digite seu nome*" value={formData.nome} onChange={handleInputChange} required /></div>
                                <div className="contact-form-group"><input type="email" name="email" placeholder="Digite seu e-mail*" value={formData.email} onChange={handleInputChange} required /></div>
                                <div className="contact-form-group"><input type="tel" name="telefone" placeholder="Digite seu telefone..." value={formData.telefone} onChange={handleInputChange} /></div>
                                <div className="contact-form-group">
                                    <select name="assunto" value={formData.assunto} onChange={handleInputChange} required>
                                        <option value="">Assunto*</option>
                                        <option value="duvida">Dúvida sobre produto</option>
                                        <option value="pedido">Informações sobre pedido</option>
                                        <option value="troca">Troca ou devolução</option>
                                        <option value="outro">Outro assunto</option>
                                    </select>
                                </div>
                                <div className="contact-form-group"><textarea name="mensagem" placeholder="Digite aqui sua mensagem*" rows="4" value={formData.mensagem} onChange={handleInputChange} required /></div>
                                <div className="contact-form-checkbox">
                                    <label>
                                        <input type="checkbox" name="aceitePrivacidade" checked={formData.aceitePrivacidade} onChange={handleInputChange} />
                                        <span>Aceito a <a href="/politica-privacidade" target="_blank" rel="noopener noreferrer">Política de Privacidade</a> *</span>
                                    </label>
                                </div>
                                <div className="contact-form-footer">
                                    <span className="contact-form-required">* Campos de preenchimento obrigatório</span>
                                    <button type="submit" className="contact-form-submit" disabled={isSubmitting}>{isSubmitting ? 'Enviando...' : 'ENVIAR'}</button>
                                </div>
                                <p className="contact-form-hours">Atendimento de segunda a sexta-feira, das 09h às 18h, exceto feriados.</p>
                            </form>
                        )}
                    </div>
                )}

                <div className="contact-widget-nav">
                    <button className={`contact-nav-item ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => { setActiveTab('chat'); setSubmitSuccess(false); }}>
                        <ChatIcon /><span>Chat</span>
                    </button>
                    <button className={`contact-nav-item ${activeTab === 'email' ? 'active' : ''}`} onClick={() => setActiveTab('email')}>
                        <MailIcon /><span>E-mail</span>
                    </button>
                </div>
            </div>

            <button
                className={`contact-widget-button ${isOpen ? 'active' : ''} ${isMobile && !isOpen && (!hasScrolled || isOverProducts) ? 'is-hidden' : ''}`}
                onClick={toggleWidget}
                aria-label={isOpen ? 'Fechar contato' : 'Abrir contato'}
            >
                {isOpen ? (
                    <TimesIcon />
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
