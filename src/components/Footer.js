import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import logo from '../img/logo2.png';
import pixLogo from '../img/pix-banco-central.svg';
import { BUSINESS } from '../config/business';

const Footer = () => (
  <footer className="footer-premium">
    <div className="footer-main-content">
      {/* Seção da Marca */}
      <div className="footer-brand-section">
        <div className="footer-logo-area">
          <img src={logo} alt="Menina Dourada" className="footer-logo-img" width="140" height="40" loading="lazy" />
          <p className="footer-brand-tagline">Biquínis premium que celebram sua beleza única e elevam sua confiança.</p>
        </div>
        
        <div className="footer-trust-badges">
          <div className="trust-badge">
            <div className="trust-icon">
              <i className="fas fa-shipping-fast"></i>
            </div>
            <div className="trust-text">
              <strong>Frete Grátis</strong>
              <span>Compras a partir de R$ 250</span>
            </div>
          </div>
          
          <div className="trust-badge">
            <div className="trust-icon">
              <i className="fas fa-undo-alt"></i>
            </div>
            <div className="trust-text">
              <strong>Troca Garantida</strong>
              <span>30 dias para trocar</span>
            </div>
          </div>
          
          <div className="trust-badge">
            <div className="trust-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            <div className="trust-text">
              <strong>Compra Segura</strong>
              <span>Dados protegidos</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Seção de Contato Premium */}
      <div className="footer-contact-section">
        <h3 className="footer-section-title">Atendimento VIP</h3>
        <div className="whatsapp-premium">
          <div className="whatsapp-info">
            <div className="whatsapp-icon">
              <i className="fab fa-whatsapp"></i>
            </div>
            <div className="whatsapp-details">
              <strong className="whatsapp-number">(21) 99804-3352</strong>
              <span className="whatsapp-hours">Segunda a Sexta: 9h às 18h</span>
              <span className="whatsapp-response">Resposta em até 2h</span>
            </div>
          </div>
          <a 
            href="https://wa.me/5521998043352" 
            className="whatsapp-cta"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Falar com especialista via WhatsApp"
          >
            <i className="fab fa-whatsapp"></i>
            Falar com Especialista
          </a>
        </div>
      </div>
      
      {/* Seção de Pagamento - Design Premium */}
      <div className="footer-payment-section">
        <h3 className="footer-section-title">Pagamento</h3>
        <div className="pix-payment-card">
          <div className="pix-header">
            <img src={pixLogo} alt="PIX" className="pix-logo" width="64" height="24" loading="lazy" />
          </div>
          <div className="pix-body">
            <span className="pix-label">Pagamento instantâneo</span>
            <ul className="pix-features">
              <li><i className="fas fa-check-circle"></i> Sem taxas</li>
              <li><i className="fas fa-check-circle"></i> Aprovação imediata</li>
              <li><i className="fas fa-check-circle"></i> 100% seguro</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Seção Social - Instagram com gradiente oficial */}
      <div className="footer-social-section">
        <h3 className="footer-section-title">Siga a Menina Dourada</h3>
        <p className="social-description">
          Bastidores, lançamentos e inspirações da coleção.
        </p>
        <a 
          href="https://www.instagram.com/meninadouradaloja/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="instagram-cta-premium"
          aria-label="Seguir Menina Dourada no Instagram"
        >
          <i className="fab fa-instagram"></i>
          <span>VER INSTAGRAM</span>
        </a>
      </div>
    </div>
    
    {/* Rodapé Inferior */}
    <div className="footer-bottom-premium">
      <div className="footer-links-premium">
        <div className="links-group">
          <h4>Loja</h4>
          <Link to="/produtos">Todos os Produtos</Link>
          <Link to="/produtos?categoria=biquinis">Biquínis</Link>
          <Link to="/produtos?categoria=maiôs">Maiôs</Link>
          <Link to="/produtos?categoria=acessorios">Acessórios</Link>
        </div>
        
        <div className="links-group">
          <h4>Suporte</h4>
          <Link to="/sobre">Nossa História</Link>
          <Link to="/contato">Fale Conosco</Link>
          <Link to="/trocas-e-devolucoes">Trocas e Devoluções</Link>
          <Link to="/politica-de-frete">Política de Frete</Link>
        </div>
        
        <div className="links-group">
          <h4>Políticas</h4>
          <Link to="/privacidade">Privacidade</Link>
          <Link to="/termos">Termos de Uso</Link>
          <Link to="/cookies">Cookies</Link>
          <Link to="/lgpd">LGPD</Link>
        </div>
      </div>
      
      <div className="footer-copyright">
        <div className="footer-copyright-brand">
          <img src={logo} alt="Menina Dourada" className="footer-copyright-logo" width="100" height="28" loading="lazy" />
          <span>© 2026 {BUSINESS.tradeName} — Todos os direitos reservados</span>
        </div>
        <span className="footer-legal-info">
          {BUSINESS.legalName} · CNPJ {BUSINESS.cnpj} · {BUSINESS.location}
        </span>
        <span className="footer-dev-note">Desenvolvido com cuidado para oferecer a melhor experiência.</span>
      </div>
    </div>
  </footer>
);

export default Footer;
