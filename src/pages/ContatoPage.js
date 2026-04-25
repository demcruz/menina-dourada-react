import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AdvancedSEO from '../seo/AdvancedSEO';
import { webPageSchema, breadcrumbSchema } from '../seo/schema';
import { BUSINESS } from '../config/business';
import '../styles/InstitucionalPage.css';

const ContatoPage = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(BUSINESS.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <AdvancedSEO
        title="Contato | Menina Dourada"
        description="Entre em contato com a Menina Dourada por WhatsApp ou e-mail. Atendimento de segunda a sexta, das 9h às 18h."
        url="https://meninadourada.shop/contato"
        canonical="https://meninadourada.shop/contato"
        jsonLd={[
          webPageSchema('Contato', 'https://meninadourada.shop/contato'),
          breadcrumbSchema([
            { name: 'Home', url: 'https://meninadourada.shop/' },
            { name: 'Contato', url: 'https://meninadourada.shop/contato' },
          ]),
        ]}
      />

      <div className="inst-page">
        <nav aria-label="Breadcrumb" style={{ fontSize: '0.85rem', padding: '1rem 0 0', color: '#888', maxWidth: 800, margin: '0 auto' }}>
          <Link to="/" style={{ color: '#888', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 0.4rem' }}>&gt;</span>
          <span style={{ color: '#555' }}>Contato</span>
        </nav>
        <div className="inst-hero">
          <span className="inst-hero-icon">💛</span>
          <h1>Fale com a Menina Dourada</h1>
          <p>Estamos aqui para ajudar você.</p>
        </div>

        <div className="inst-section">
          <p>
            Caso tenha dúvidas, sugestões ou precise de suporte com seu pedido, entre em
            contato com a nossa equipe pelos canais abaixo.
          </p>
        </div>

        <div className="inst-section">
          <h2>💬 WhatsApp</h2>
          <a
            href={BUSINESS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inst-contact-card whatsapp inst-email-btn"
            style={{ maxWidth: '360px' }}
          >
            <span className="inst-contact-icon">💬</span>
            <strong>{BUSINESS.phone}</strong>
            <span>Clique para abrir o WhatsApp</span>
          </a>
        </div>

        <div className="inst-section">
          <h2>✉️ E-mail</h2>
          <button
            onClick={handleCopyEmail}
            className="inst-contact-card email inst-email-btn"
          >
            <span className="inst-contact-icon">✉️</span>
            <strong>{BUSINESS.email}</strong>
            <span>{copied ? '✓ Copiado!' : 'Clique para copiar'}</span>
          </button>
        </div>

        <div className="inst-section">
          <h2>🕐 Horário de Atendimento</h2>
          <ul>
            <li><strong>Segunda a sexta:</strong> 9h às 18h</li>
          </ul>
        </div>

        <div className="inst-section">
          <div className="inst-highlight">
            <p>
              Nosso compromisso é oferecer uma experiência segura, rápida e transparente para você.
              Respondemos e-mails em até 24 horas úteis.
            </p>
          </div>
        </div>

        <Link to="/produtos" className="inst-back">← Voltar para a loja</Link>
      </div>
    </>
  );
};

export default ContatoPage;
