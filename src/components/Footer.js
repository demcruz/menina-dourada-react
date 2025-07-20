
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="container mx-auto px-4">
                <div className="footer-grid md:grid-cols-4">
                 
                    <div>
                        <h3 className="footer-section-title">Menina Dourada</h3>
                        <p className="footer-paragraph">Biquínis e moda praia que celebram o verão e empoderam mulheres.</p>
                    </div>

                
                    <div>
                        <h4 className="footer-list-title">Links</h4>
                        <ul className="footer-link-list">
                            <li><Link to="/" className="hover:text-gold-400 transition">Home</Link></li>
                            <li><Link to="/shop" className="hover:text-gold-400 transition">Loja</Link></li>
                            <li><Link to="/about" className="hover:text-gold-400 transition">Sobre Nós</Link></li>
                            <li><Link to="/contact" className="hover:text-gold-400 transition">Contato</Link></li>
                        </ul>
                    </div>

                  
                    <div>
                        <h4 className="footer-list-title">Contato e Redes</h4>
                        <ul className="footer-link-list">
                        
                            <li className="contact-info-item">
                                <i className="fas fa-envelope contact-info-icon"></i>
                                <p className="contact-info-text">contato@meninadourada.com.br</p>
                            </li>
                            <li className="contact-info-item">
                                <i className="fab fa-whatsapp contact-info-icon"></i>
                                <div>
                                    <p className="contact-info-text">(11) 98765-4321</p>
                                    <a href="https://wa.me/5511987654321" className="contact-whatsapp-link" target="_blank" rel="noopener noreferrer">Enviar mensagem</a>
                                </div>
                            </li>
                            <li className="contact-info-item">
                                <i className="fas fa-map-marker-alt contact-info-icon"></i>
                                <p className="contact-info-text">Rua das Praias, 123 - São Paulo/SP</p>
                            </li>
                        </ul>

                       
                        <div className="footer-social-icons-list">
                            
                            <a href="https://instagram.com/meninadourada" className="social-icon-button" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a href="https://facebook.com/meninadourada" className="social-icon-button" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="https://pinterest.com/meninadourada" className="social-icon-button" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-pinterest-p"></i>
                            </a>
                            <a href="https://tiktok.com/@meninadourada" className="social-icon-button" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-tiktok"></i>
                            </a>
                        </div>
                    </div>

                   
                    <div>
                        <h4 className="footer-list-title">Ajuda</h4>
                        <ul className="footer-link-list">
                           
                            <li><Link to="/trocas-devolucoes" className="hover:text-gold-400 transition">Trocas e Devoluções</Link></li>
                            <li><Link to="/politica-privacidade" className="hover:text-gold-400 transition">Política de Privacidade</Link></li>
                            <li><Link to="/termos-servico" className="hover:text-gold-400 transition">Termos de Serviço</Link></li>
                            <li><Link to="/faq" className="hover:text-gold-400 transition">Perguntas Frequentes</Link></li>
                        </ul>

                        <h4 className="footer-list-title mt-4">Pagamentos</h4>
                        <div className="footer-payment-icons">
                           
                            <div className="payment-icon-item">
                                <i className="fab fa-cc-visa"></i>
                            </div>
                            <div className="payment-icon-item">
                                <i className="fab fa-cc-mastercard"></i>
                            </div>
                            <div className="payment-icon-item">
                                <i className="fab fa-cc-amex"></i>
                            </div>
                            <div className="payment-icon-item">
                                <i className="fas fa-barcode"></i>
                            </div>
                            <div className="payment-icon-item">
                                <i className="fab fa-pix"></i>
                            </div>
                            <div className="payment-icon-item">
                                <i className="fas fa-money-bill-wave"></i>
                            </div>
                        </div>
                        <p className="footer-paragraph">Compra 100% segura</p>
                    </div>
                </div>

                <div className="footer-copyright">
                    <p>&copy; {new Date().getFullYear()} Menina Dourada. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;