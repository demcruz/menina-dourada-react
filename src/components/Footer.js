import { useRef } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import logo from '../img/logo2.png';
import pixLogo from '../img/pix-banco-central.svg';
import { BUSINESS } from '../config/business';

// SVG icons inline — substituem Font Awesome CDN
const TruckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);
const UndoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
  </svg>
);
const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);
const CheckCircleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const Footer = () => {
  const footerRef = useRef(null);

  return (
    <footer className="footer-premium" ref={footerRef}>
      <div className="footer-main-content">
        {/* Seção da Marca */}
        <div className="footer-brand-section">
          <div className="footer-logo-area">
            <img src={logo} alt="Menina Dourada" className="footer-logo-img" width="140" height="40" loading="lazy" />
            <p className="footer-brand-tagline">Biquínis premium que celebram sua beleza única e elevam sua confiança.</p>
          </div>

          <div className="footer-trust-badges">
            <div className="trust-badge">
              <div className="trust-icon"><TruckIcon /></div>
              <div className="trust-text">
                <strong>Frete Grátis</strong>
                <span>Compras a partir de R$ 250</span>
              </div>
            </div>
            <div className="trust-badge">
              <div className="trust-icon"><UndoIcon /></div>
              <div className="trust-text">
                <strong>Troca Garantida</strong>
                <span>30 dias para trocar</span>
              </div>
            </div>
            <div className="trust-badge">
              <div className="trust-icon"><ShieldIcon /></div>
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
              <div className="whatsapp-icon"><WhatsAppIcon /></div>
              <div className="whatsapp-details">
                <strong className="whatsapp-number">(21) 97313-7347</strong>
                <span className="whatsapp-hours">Segunda a Sexta: 9h às 18h</span>
                <span className="whatsapp-response">Resposta em até 2h</span>
              </div>
            </div>
            <a
              href="https://wa.me/5521973137347"
              className="whatsapp-cta"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Falar com especialista via WhatsApp"
            >
              <WhatsAppIcon />
              Falar com Especialista
            </a>
          </div>
        </div>

        {/* Seção de Pagamento */}
        <div className="footer-payment-section">
          <h3 className="footer-section-title">Pagamento</h3>
          <div className="pix-payment-card">
            <div className="pix-header">
              <img src={pixLogo} alt="PIX" className="pix-logo" width="64" height="24" loading="lazy" />
            </div>
            <div className="pix-body">
              <span className="pix-label">Pagamento instantâneo</span>
              <ul className="pix-features">
                <li><CheckCircleIcon /> Sem taxas</li>
                <li><CheckCircleIcon /> Aprovação imediata</li>
                <li><CheckCircleIcon /> 100% seguro</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Seção Social */}
        <div className="footer-social-section">
          <h3 className="footer-section-title">Siga a Menina Dourada</h3>
          <p className="social-description">Bastidores, lançamentos e inspirações da coleção.</p>
          <a
            href="https://www.instagram.com/meninadouradaloja/"
            target="_blank"
            rel="noopener noreferrer"
            className="instagram-cta-premium"
            aria-label="Seguir Menina Dourada no Instagram"
          >
            <InstagramIcon />
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
};

export default Footer;
