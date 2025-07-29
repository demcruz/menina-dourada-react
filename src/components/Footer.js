import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer-uiux">
    <div className="footer-content">
      <div className="footer-brand">
        <h2 className="footer-title">Menina Dourada</h2>
        <p className="footer-description">
          Biquínis e moda praia que celebram o verão e empoderam mulheres.
        </p>
      </div>
      <div className="footer-links">
        <h3>Links</h3>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/shop">Loja</Link></li>
          <li><Link to="/about">Sobre Nós</Link></li>
          <li><Link to="/contact">Contato</Link></li>
        </ul>
      </div>
      <div className="footer-contact">
        <h3>Contato & Redes</h3>
        <ul>
          <li>
            <span className="footer-icon"><i className="fas fa-envelope"></i></span>
            <a href="mailto:contato@meninadourada.com.br">contato@meninadourada.com.br</a>
          </li>
          <li>
            <span className="footer-icon"><i className="fab fa-whatsapp"></i></span>
            <a href="tel:+5511987654321">(11) 98765-4321</a>
          </li>
          <li>
            <span className="footer-icon"><i className="fas fa-map-marker-alt"></i></span>
            Rua das Praias, 123 - São Paulo/SP
          </li>
        </ul>
        <div className="footer-social">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
          <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest"><i className="fab fa-pinterest"></i></a>
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok"><i className="fab fa-tiktok"></i></a>
        </div>
      </div>
      <div className="footer-help">
        <h3>Ajuda</h3>
        <ul>
          <li><Link to="/trocas">Trocas e Devoluções</Link></li>
          <li><Link to="/privacidade">Política de Privacidade</Link></li>
          <li><Link to="/termos">Termos de Serviço</Link></li>
          <li><Link to="/faq">Perguntas Frequentes</Link></li>
        </ul>
      </div>
      <div className="footer-payments">
        <h3>Pagamentos</h3>
        <div className="footer-payment-icons">
          <i className="fab fa-cc-visa"></i>
          <i className="fab fa-cc-mastercard"></i>
          <i className="fab fa-cc-amex"></i>
          <i className="fas fa-barcode"></i>
          <i className="fas fa-money-bill-wave"></i>
          <i className="fas fa-qrcode"></i>
        </div>
        <span className="footer-secure">Compra 100% segura</span>
      </div>
    </div>
    <div className="footer-bottom">
      <span>© 2025 Menina Dourada. Todos os direitos reservados.</span>
    </div>
  </footer>
);

export default Footer;