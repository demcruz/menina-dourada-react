import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AdvancedSEO from '../seo/AdvancedSEO';
import { webPageSchema } from '../seo/schema';
import '../styles/InstitucionalPage.css';

const ContatoPage = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('contato@meninadourada.shop').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <AdvancedSEO
        title="Contato | Menina Dourada"
        description="Entre em contato com a Menina Dourada. Atendimento por e-mail de segunda a sexta, das 9h às 18h."
        url="https://meninadourada.shop/contato"
        canonical="https://meninadourada.shop/contato"
        jsonLd={webPageSchema('Contato', 'https://meninadourada.shop/contato')}
      />

      <div className="inst-page">
        <div className="inst-hero">
          <span className="inst-hero-icon">💛</span>
          <h1>Fale com a Menina Dourada</h1>
          <p>Estamos aqui para ajudar você.</p>
        </div>

        <div className="inst-section">
          <p>
            Caso tenha dúvidas, sugestões ou precise de suporte com seu pedido, entre em
            contato com a nossa equipe.
          </p>
        </div>

        <div className="inst-section">
          <h2>✉️ E-mail</h2>
          <button
            onClick={handleCopyEmail}
            className="inst-contact-card email inst-email-btn"
          >
            <span className="inst-contact-icon">✉️</span>
            <strong>contato@meninadourada.shop</strong>
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
            </p>
          </div>
        </div>

        <Link to="/produtos" className="inst-back">← Voltar para a loja</Link>
      </div>
    </>
  );
};

export default ContatoPage;
